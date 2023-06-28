const mongoose = require('mongoose');

const productPriceSchema = mongoose.Schema({
  productId: String,
  productName: String,
  categoryName: String,
  groupName: String,
  unit: String,
  date: Date,
  priceMin: Number,
  priceMax: Number,
});

const ProductPrice = mongoose.model("ProductPrice", productPriceSchema);

module.exports = {
  ProductPrice
};
