const { user } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { product } = require("../models/product.model");
const mongoose = require('mongoose');
async function login({ email, password }, callback) {
    const userModel = await user.findOne({ email }).select("+password")



    if (userModel != null) {
        if (bcrypt.compareSync(password, userModel.password)) {
            const token = auth.generateAccessToken(userModel.toJSON());
            return callback(null, { ...userModel.toJSON(), token });
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
        const productModel = await product.findById(ProductId);

        let userModel = await user.findOne({ email: UserEmail });

        if (userModel.cart.length == 0) {
            userModel.cart.push({ product: productModel, quantity: 1 });
        } else {
            let isProductFound = false;
            for (let i = 0; i < userModel.cart.length; i++) {
                if (userModel.cart[i].product._id.equals(productModel._id)) {
                    isProductFound = true;
                }
            }

            if (isProductFound) {
                let producttt = userModel.cart.find((productt) =>
                    productt.product._id.equals(productModel._id)
                );
                producttt.quantity += 1;
            } else {
                userModel.cart.push({ product: productModel, quantity: 1 });
            }
        }
        userModel = await userModel.save();
        return userModel;
    } catch (e) {
        throw new Error(e.message);
    }
}


async function removeFromCart(userId, productId) {
    try {
        const product = await Product.findById(productId);
        let userModel = await user.findById(userId);

        for (let i = 0; i < userModel.cart.length; i++) {
            if (userModel.cart[i].product._id.equals(product._id)) {
                if (userModel.cart[i].quantity == 1) {
                    userModel.cart.splice(i, 1);
                } else {
                    user.cart[i].quantity -= 1;
                }
            }
        }
        user = await user.save();
        return user;
    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports = {
    login,
    register,
    addToCart,
    removeFromCart
}