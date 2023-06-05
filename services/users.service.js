const { user } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { product } = require("../models/product.model");
const { category } = require("../models/category.model");
const mongoose = require('mongoose');
const { order } = require('../models/order.model');
const categoriesService = require("../services/categories.service");
const generatePayload = require('promptpay-qr')

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



async function register(params, callback) {
    if (params.email === undefined) {
        return callback({
            message: "Email Reqired!"
        });
    }

    let isUserExist = await user.findOne({ email: params.email });

    if (isUserExist) {
        return callback({
            message: "Email already registered!"
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

        console.log(productIndex);
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

        const { cart, totalPrice, address, userId } = orderData;
        console.log(orderData);
        let products = [];

        for (let i = 0; i < cart.length; i++) {
            //console.log(cart[i].product._id);
            let productModel = await product.findById(cart[i].product._id);
            //console.log(productModel);
            if (productModel.productSKU >= cart[i].quantity) {
                productModel.productSKU -= cart[i].quantity;

                products.push({ product: productModel, productSKU: cart[i].quantity });

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
            orderedAt: new Date().getTime(),
        });
        orderModel = await orderModel.save();

  
        return orderModel;
    } catch (e) {
        throw new Error(e.message);
    }
}


async function myOrder(id) {
    try {
        let orders = await order.find({ userId: id })
            .select('-__v')
            .populate({ path: 'products.product', select: '-__v -relatedProduct' });
        return orders;
    } catch (e) {
        throw new Error(e.message);
    }
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
                        productQuantity : productQuantity,
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

        return merchantOrder;
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
        for(var i = 0 ; i < orders.products.length; i ++){
            if(  orders.products[i].product._id.toString() === productId){
                
                if(orders.products[i].product.storeId.toString() === storeId){
                    orders.products[i].statusProductOrder = status;
                    updatedOrder = await orders.save();
                }else{
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
       
        let totalEarnings = 0;
        let categoryId;      
        let categories;
        let fruitEarnings = 0;
        let vegetableEarnings = 0;
        let drtFruitEarnings = 0;

        for(let i = 0 ; i < orders.length ; i++){
            for(let j = 0 ; j < orders[i].products.length; j++){
                let productId = orders[i].products[j].product._id.toString();
                let products = await product.findById(productId);
                
                if(products.storeId.toString() === storeId){
                    totalEarnings += orders[i].products[j].productSKU * products.productPrice;
                    categoryId = products.category.toString();
                    categories = await category.findById(categoryId);
                    if(categories.categoryName === "Fruit"){
                        fruitEarnings += orders[i].products[j].productSKU * products.productPrice;
                        
                    }
                    if(categories.categoryName === "Vegetable"){
                        vegetableEarnings += orders[i].products[j].productSKU * products.productPrice;
                    }
                    if(categories.categoryName === "Dry Friut"){
                        drtFruitEarnings += orders[i].products[j].productSKU * products.productPrice;
                    }
                }
               
             }
        }
     
       
       let earnnings = {
        totalEarnings,
        fruitEarnings,
        vegetableEarnings,
        drtFruitEarnings
       }
        return earnnings;
    } catch (error) {
        throw new Error(error.message);
    }
}


async function generateQR(data) {
    try {
      const { totalAmount, storeTel } = data;
      const amount =  parseFloat(totalAmount)
      const payload = generatePayload(storeTel, { amount: amount });
      return payload;
    } catch (error) {
      throw new Error(error.message);
    }
  }


module.exports = {
    login,
    register,
    addToCart,
    removeFromCart,
    saveAddress,
    placeOrder,
    myOrder,
    merchantOrder,
    changeStatus,
    analytics,
    generateQR
}