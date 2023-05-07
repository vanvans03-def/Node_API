const { user } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { product } = require("../models/product.model");
const mongoose = require('mongoose');
const { order } = require('../models/order.model');

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


        let userModel = await user.findOne({ email: UserEmail }).populate({ path: 'cart.product', select: '-__v -relatedProduct' });
        //console.log(userModel);
        const productIndex = userModel.cart.findIndex(item => item.product._id.equals(productModel._id));

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
        let orders = await order.find({ userId: id }).populate({ path: 'products.product', select: '-__v -relatedProduct' });
        return orders;
    } catch (e) {
        throw new Error(e.message);
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
}