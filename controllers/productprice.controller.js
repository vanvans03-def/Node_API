const ProductService = require('../services/productprice.service');

async function findAll(req, res) {
  try {
    const productPrices = await ProductService.getAllProductPrices();
    res.status(200).json(productPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function findById(req, res) {
  const { id  } = req.params;
  try {
    const productPrice = await ProductService.getProductPriceById(id );
    res.status(200).json(productPrice);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function searchProductPrices(req, res) {
  const { productName,productType } = req.query;

  try {
    const productPrices = await ProductService.searchProductPrices(productName,productType);
    res.status(200).json(productPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  findAll,
  findById,
  searchProductPrices
};
