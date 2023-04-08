const mongoose = require("mongoose");


const productPriceSchema = mongoose.model(
    "ProductPrice",
    mongoose.Schema({
    productId: String,
    productName: String,
    categoryName: String,
    groupName: String,
    unit: String,
    date: Date,
    priceMin: Number,
    priceMax: Number,
    })
);

module.exports = {
    ProductPrice,
};