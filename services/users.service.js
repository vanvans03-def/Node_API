const { user } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { product } = require("../models/product.model");
const { category } = require("../models/category.model");
const mongoose = require('mongoose');
const { order } = require('../models/order.model');
const categoriesService = require("../services/categories.service");
const generatePayload = require('promptpay-qr')
const { store } = require("../models/store.model");


const ejs = require('ejs');
const nodemailer = require('nodemailer');
const htmlToPdf = require('html-pdf-node');





async function login({ email, password }, callback) {
    const userModel = await user.findOne({ email }).select("+password -__v -relatedProduct").lean();
    if (userModel != null) {
        if (bcrypt.compareSync(password, userModel.password)) {
            const token = auth.generateAccessToken(userModel);
            const userModelWithProducts = await user.populate(userModel, { path: "cart.product", select: "-__v -relatedProduct" });
            return callback(null, { ...userModelWithProducts, token });
        } else {
            return callback({
                message: "Invalid Email/Password"
            });
        }
    } else {
        return callback({
            message: "Invalid Email/Password"
        });
    }
}

async function registerOauth(params, callback) {

    let isUserExist = await user.findOne({ email: params.email });

    if (isUserExist) {
        return callback({
            message: "Email already registered!"
        });
    }

    let isFullNameExist = await user.findOne({ fullName: params.fullName });

    if (isFullNameExist) {
        return callback({
            message: "Username already exists!"
        });
    }

    const userSchema = new user(params);

    const userModelWithProducts = await user.populate(userSchema, { path: "cart.product", select: "-__v -relatedProduct" });
    if (userModelWithProducts) {
        userModelWithProducts.save()
            .then((response) => {
                return callback(null, response);
            })
            .catch((error) => {
                return callback(error);
            });
    } else {

    }
}


async function register(params, callback) {
    if (params.email === undefined) {
        return callback({
            message: "Email Required!"
        });
    }

    let isUserExist = await user.findOne({ email: params.email });

    if (isUserExist) {
        return callback({
            message: "Email already registered!"
        });
    }

    let isFullNameExist = await user.findOne({ fullName: params.fullName });

    if (isFullNameExist) {
        return callback({
            message: "Username already exists!"
        });
    }

    const salt = bcrypt.genSaltSync(10);
    params.password = bcrypt.hashSync(params.password, salt);

    const userSchema = new user(params);
    userSchema.save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}



async function addToCart(userData) {
    try {
        const { UserEmail, ProductId } = userData;

        const productModel = await product.findById(ProductId).select('-relatedProduct -__v');
        //console.log(productModel);

        let userModel = await user.findOne({ email: UserEmail }).populate({ path: 'cart.product', select: '-__v -relatedProduct' });

        if (!userModel.cart || !Array.isArray(userModel.cart)) {
            throw new Error('ค่า userModel.cart ไม่ถูกต้อง');
        }

        const productIndex = userModel.cart.findIndex(item => item.product && item.product._id && item.product._id.equals(productModel._id));


        if (productIndex !== -1) {
            userModel.cart[productIndex].quantity += 1;
        } else {
            userModel.cart.push({ product: productModel, quantity: 1 });
        }

        userModel = await userModel.save();
        return userModel;
    } catch (e) {
        throw new Error(e.message);
    }
}


async function removeFromCart(userData) {
    try {
        const { UserEmail, ProductId } = userData;
        const productModel = await product.findById(ProductId);

        let userModel = await user.findOne({ email: UserEmail }).populate({ path: 'cart.product', select: '-__v -relatedProduct' });

        if (userModel.cart.length == 0) {
            userModel.cart.push({ product: productModel, quantity: 1 });
        } else {
            let isProductFound = false;
            for (let i = 0; i < userModel.cart.length; i++) {
                if (userModel.cart[i].product._id.equals(productModel._id)) {
                    if (userModel.cart[i].quantity == 1) {
                        userModel.cart.splice(i, 1);
                    } else {
                        userModel.cart[i].quantity -= 1;
                    }
                }
            }

        }
        userModel = await userModel.save();
        return userModel;
    } catch (e) {
        throw new Error(e.message);
    }
}

//save user address 

async function saveAddress(userData) {
    try {
        const { UserEmail, Address } = userData;


        let userModel = await user.findOne({ email: UserEmail });
        userModel.address = Address;
        userModel = await userModel.save();
        return userModel;
    } catch (e) {
        throw new Error(e.message);
    }
}

//order product
async function placeOrder(orderData) {
    try {

        const { cart, totalPrice, address, userId, image,deliveryType } = orderData;

        let products = [];
        let orderMerchantdata = [];
        for (let i = 0; i < cart.length; i++) {
            //console.log(cart[i].product._id);
            let productModel = await product.findById(cart[i].product._id);
            //console.log(productModel);
            if (productModel.productSKU >= cart[i].quantity) {
                productModel.productSKU -= cart[i].quantity;

                products.push({ product: productModel, productSKU: cart[i].quantity });

                let data = await merchantOrder(productModel.storeId.toString());
                orderMerchantdata.push(data[0]); 
                await productModel.save();

            } else {
                throw new Error(`${productModel.productName} is out of stock!`);
            }
        }

        let userModel = await user.findById(userId);
        userModel.cart = [];
        userModel = await userModel.save();

        let orderModel = new order({
            products,
            totalPrice,
            address,
            userId,
            image,
            orderedAt: new Date().getTime(),
            deliveryType,
        });
        console.log(orderModel);
        orderModel = await orderModel.save();

        let dataforPdf = removeDuplicates(orderMerchantdata)

        for (var i = 0; i < dataforPdf.length; i++) {
            //sendMail(dataforPdf[i]);
        }

        return orderModel;
    } catch (e) {
        throw new Error(e.message);
    }
}

async function sendMail(dataforPdf) {
    try {
      
        const storeModel = await store.findById(dataforPdf.products[0].storeId.toString())
      
        const users = await user.findById(storeModel.user).select('-cart');
       
        const pdfBuffer = await generatePdf(dataforPdf);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'defoko13@gmail.com',
                pass: 'hslcmkvglavexqij',
            },
        });
        let emailStore = users.email;
        console.log(emailStore);
        const mailOptions = {
            from: 'defoko13@gmail.com',
            //to: emailStore,
            to: 'teerahitchana@gmail.com',
            subject: 'มีออเดอร์มาใหม่',
            text: 'มีคำสั่งซื้อเข้ามาใหม่',
            attachments: [
                {
                    filename: 'generated.pdf',
                    content: pdfBuffer,
                },
            ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(400).json({
                    RespCode: 400,
                    RespMessage: 'Bad Request',
                    RespError: error,
                });
            } else {
                console.log('Email sent:', info.response);
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'Email sent successfully',
                });
            }
        });
    } catch (error) {
        console.log('Error generating PDF:', error);
        return res.status(500).json({
            RespCode: 500,
            RespMessage: 'Internal Server Error',
            RespError: error,
        });
    }
}

async function generatePdf(order) {
    const users = await user.findById(order.userId).select('-cart');

    const modifiedOrder = {
        products: order.products.map((product) => ({
            productName: product.productName,
            productPrice: product.productPrice,
            productQuantity: product.productQuantity,
        })),
        totalPrice: order.totalPrice,
        address: order.address,
        userId: users.fullName,
        orderedAt: order.orderedAt
    };

    const htmlPdf = await ejs.renderFile(
        "./views/layout.html.ejs",
        { rows: modifiedOrder.products, order: modifiedOrder },
        { async: true }
    );

    const options = { format: 'A4' };
    const file = { content: htmlPdf };

    const pdfBuffer = await htmlToPdf.generatePdf(file, options);
    return pdfBuffer;
}



function removeDuplicates(arr) {
    var clean = arr.filter((item, index, self) =>
        index === self.findIndex((t) => t._id.toString() === item._id.toString())
    );

    return clean;
}

//merchant get order
async function merchantOrder(id) {
    try {
        let orders = await order
            .find({ storeId: id })
            .select('-__v')
            .populate({ path: 'products.product', select: '-__v -relatedProduct' });

        let merchantOrder = [];

        for (var i = 0; i < orders.length; i++) {
            let orderProducts = orders[i].products;
            let productInOrder = [];
            let totalPrice = 0;
            let statusProduct;
            let productQuantity;
            for (var j = 0; j < orderProducts.length; j++) {
                if (orderProducts[j].product.storeId.toString() === id) {
                    let product = orderProducts[j].product;
                    product.statusProduct = orders[i].products[j].statusProductOrder;

                    let productPrice = product.productPrice || 0;
                    let quantity = orders[i].products[j].productSKU || 0;
                    totalPrice += productPrice * quantity;
                    statusProduct = orders[i].products[j].statusProductOrder;
                    productQuantity = orders[i].products[j].productSKU;
                    let modifiedProduct = {
                        ...orderProducts[j].product._doc,
                        productQuantity: productQuantity,
                        statusProductOrder: statusProduct
                    };
                    productInOrder.push(modifiedProduct);
                }
            }

            if (productInOrder.length > 0) {
                let modifiedOrder = {
                    ...orders[i]._doc,
                    products: productInOrder,
                    totalPrice: totalPrice,

                };
                merchantOrder.push(modifiedOrder);
            }
        }

        merchantOrder.sort((a, b) => b.orderedAt - a.orderedAt);
        return merchantOrder;
    } catch (e) {
        throw new Error(e.message);
    }
}



async function myOrder(id) {
    try {
        let orders = await order.find({ userId: id })
            .select('-__v')
            .populate({ path: 'products.product', select: '-__v -relatedProduct' })
            .sort({ orderedAt: -1 });

        return orders;
    } catch (e) {
        throw new Error(e.message);
    }
}

async function changeStatus(data) {
    try {
        const { orderId, storeId, status, productId } = data;
        let updatedOrder;
        let orders = await order.findById(orderId)
            .select('-__v')
            .populate({ path: 'products.product', select: '-__v -relatedProduct' });

        if (!orders) {
            throw new Error('Order not found');
        }
        for (var i = 0; i < orders.products.length; i++) {
            if (orders.products[i].product._id.toString() === productId) {

                if (orders.products[i].product.storeId.toString() === storeId) {
                    orders.products[i].statusProductOrder = status;
                    updatedOrder = await orders.save();
                } else {
                    return "Data not math";
                }
            }
        }
        return updatedOrder;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function analytics(data) {
    try {
        const { storeId } = data;
        const orders = await order.find({});

        let totalEarnings = 0; //ยอดรวม
        let categoryId; //ไอดีของแต่ละ category
        let categories; 
        let fruitEarnings = 0; 
        let vegetableEarnings = 0;
        let drtFruitEarnings = 0;

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].products.length; j++) {
                let productId = orders[i].products[j].product._id.toString();
                let products = await product.findById(productId);

                if (products.storeId.toString() === storeId) {
                    totalEarnings += orders[i].products[j].productSKU * products.productPrice;
                    categoryId = products.category.toString();
                    categories = await category.findById(categoryId);
                    if (categories.categoryName === "Fruit") {
                        fruitEarnings += orders[i].products[j].productSKU * products.productPrice;

                    }
                    if (categories.categoryName === "Vegetable") {
                        vegetableEarnings += orders[i].products[j].productSKU * products.productPrice;
                    }
                    if (categories.categoryName === "Dry Friut") {
                        drtFruitEarnings += orders[i].products[j].productSKU * products.productPrice;
                    }
                }

            }
        }


        let earnnings = {
            totalEarnings,//110
            fruitEarnings,//110
            vegetableEarnings,
            drtFruitEarnings
        }
        return earnnings;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function analyticsByDate(data) {
    try {
        const { storeId, startDate, endDate } = data;
        let orders;
        if (startDate != "" && endDate != "") {
            const start = new Date(startDate); // แปลงวันที่เริ่มต้นให้กลายเป็นวัตถุของวันที่
            const end = new Date(endDate); // แปลงวันที่สิ้นสุดให้กลายเป็นวัตถุของวันที่

            orders = await order.find({
                orderedAt: {
                    $gte: start, // กรองเอกสารที่มีเวลาสร้างมากกว่าหรือเท่ากับวันที่เริ่มต้น
                    $lte: end, // กรองเอกสารที่มีเวลาสร้างน้อยกว่าหรือเท่ากับวันที่สิ้นสุด
                },
            });
        } else {
            orders = await order.find({});
        }


        let totalEarnings = 0;
        let categoryId;
        let categories;
        let fruitEarnings = 0;
        let vegetableEarnings = 0;
        let drtFruitEarnings = 0;

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].products.length; j++) {
                let productId = orders[i].products[j].product._id.toString();
                let products = await product.findById(productId);

                if (products.storeId.toString() === storeId) {
                    totalEarnings += orders[i].products[j].productSKU * products.productPrice;
                    categoryId = products.category.toString();
                    categories = await category.findById(categoryId);
                    if (categories.categoryName === "Fruit") {
                        fruitEarnings += orders[i].products[j].productSKU * products.productPrice;
                    }
                    if (categories.categoryName === "Vegetable") {
                        vegetableEarnings += orders[i].products[j].productSKU * products.productPrice;
                    }
                    if (categories.categoryName === "Dry Friut") {
                        drtFruitEarnings += orders[i].products[j].productSKU * products.productPrice;
                    }
                }
            }
        }

        let earnings = {
            totalEarnings,
            fruitEarnings,
            vegetableEarnings,
            drtFruitEarnings
        };
        return earnings;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function generateQR(data) {
    try {
        const { totalAmount, storeTel } = data;
        const amount = parseFloat(totalAmount)
        const payload = generatePayload(storeTel, { amount: amount });
        return payload;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function getUserData(data) {
    try {
        const users = await user.findById(data).select('-cart');
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function updateUserData(userData) {
    try {


        const { fullName, phoneNumber, address, image, id } = userData;

        let userModel;

        // ตรวจสอบว่ามีชื่อซ้ำหรือไม่

        userModel = await user.findById(id);
        if (userModel.fullName != fullName) {
            const isUserExist = await user.findOne({ fullName: fullName });

            if (isUserExist) {
                throw new Error('Error Full Name is already registered!');
            }
        }

        if (image == "") {
            userModel.address = address;
            userModel.fullName = fullName;
            userModel.phoneNumber = phoneNumber;

        } else {
            userModel.address = address;
            userModel.fullName = fullName;
            userModel.phoneNumber = phoneNumber;
            userModel.image = image;
        }

        userModel = await userModel.save();



        return userModel;
    } catch (e) {
        throw new Error(e.message);
    }
}


module.exports = {
    login,
    register,
    registerOauth,
    addToCart,
    removeFromCart,
    saveAddress,
    placeOrder,
    myOrder,
    merchantOrder,
    changeStatus,
    analytics,
    generateQR,
    getUserData,
    analyticsByDate,
    updateUserData
}