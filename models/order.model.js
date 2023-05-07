const mongoose = require("mongoose");
const { productSchema } = require("./product.model");

const orderSchema = mongoose.Schema({
  products: [{
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      productSKU: {
        type: String,
        required: true,
      },
  },  
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  userId: {
    required: true,
    type: String,
  },
  orderedAt: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;