const mongoose = require("mongoose");
const { product } = require("./product.model");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
     
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    image:{
      type:String,
      default: "",
    },
    type: {
      type: String,
      default: "user",
    },
    cart: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true
      }
    }],

  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.userId = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      }
    }
  }, {
  timestamp: true
});
/*
userSchema
  .virtual('cartItems', {
    ref: 'Product',
    localField: 'cart.product',
    foreignField: '_id'
  });*/

const user = mongoose.model(
  "User",
  userSchema
);

module.exports = {
  user
};
