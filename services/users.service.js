const { User } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { Product } = require("../models/product.model");

async function login({ email, password }, callback) {
    const userModel = await User.findOne({email}).select("+password")
   


    if (userModel != null) {
        if (bcrypt.compareSync(password, userModel.password)) {
            const token = auth.generateAccessToken(userModel.toJSON());
            return callback(null, {...userModel.toJSON(), token });
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

    let isUserExist = await User.findOne({email:params.email});

    if (isUserExist) {
        return callback({
            message: "Email already registered!"
        });
    }

    const salt = bcrypt.genSaltSync(10);
    params.password = bcrypt.hashSync(params.password, salt);

    const userSchema = new User(params);
    userSchema.save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
}


async function addToCart(userId, productId) {
    try {
      const product = await Product.findById(productId);
      let user = await User.findById(userId);
  
      if (user.cart.length == 0) {
        user.cart.push({ product, quantity: 1 });
      } else {
        let isProductFound = false;
        for (let i = 0; i < user.cart.length; i++) {
          if (user.cart[i].product._id.equals(product._id)) {
            isProductFound = true;
          }
        }
  
        if (isProductFound) {
          let producttt = user.cart.find((productt) =>
            productt.product._id.equals(product._id)
          );
          producttt.quantity += 1;
        } else {
          user.cart.push({ product, quantity: 1 });
        }
      }
      user = await user.save();
      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  
  async function removeFromCart(userId, productId) {
    try {
      const product = await Product.findById(productId);
      let user = await User.findById(userId);
  
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          if (user.cart[i].quantity == 1) {
            user.cart.splice(i, 1);
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