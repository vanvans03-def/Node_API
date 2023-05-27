const { ProductPrice } = require('../models/productprice.model');

async function getAllProductPrices() {
  try {
    const productPrices = await ProductPrice.find({}).select('-__v');;
    return productPrices;
  } catch (error) {
    throw new Error(error);
  }
}

async function getProductPriceById(productId) {
  try {
    const productPrice = await ProductPrice.findOne({ productId });
    if (!productPrice) {
      throw new Error('Product price not found');
    }
    return productPrice;
  } catch (error) {
    throw new Error('Failed to retrieve product price');
  }
}


async function searchProductPrices(productName) {
  try {
    const productPrices = await ProductPrice.find({
      $or: [
        { productName: { $regex: productName, $options: 'i' } }
      ]
    });
   
    return productPrices;
  } catch (error) {
    throw new Error('Failed to search product prices');
  }
}

module.exports = {
  getAllProductPrices,
  getProductPriceById,
  searchProductPrices
};
