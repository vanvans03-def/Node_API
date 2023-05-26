const categoryController = require("../controllers/categories.controllers");
const userController = require("../controllers/users.controller");
const productController = require("../controllers/products.controller");
const storeController = require("../controllers/stores.controller");
const sliderController = require("../controllers/slider.controller");
const relatedProductController = require("../controllers/related-product.controller");
const express = require("express");
const router = express.Router();
const { authenticationToken } = require("../middleware/auth");
const Product = require("../models/product.model");
const provinceController = require("../controllers/provinces.controllers");
const productpricesController = require("../controllers/productprice.controller");
router.get("/province", provinceController.findAll);
router.post("/generateQR", userController.generateQR);

router.post("/category", categoryController.create);
router.get("/category", categoryController.findAll);
router.get("/category/:id", categoryController.findOne);
router.put("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.delete);

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/product/search/:productName", productController.searchProduct);
router.post("/product", productController.create);
router.get("/product", productController.findAll);
router.get("/product/:id", productController.findOne);
router.put("/product/:id", productController.update);
router.delete("/product/:id", productController.delete);
router.post("/rate-product",authenticationToken,productController.rateProduct);
router.get('/product/store/:storeId',productController.getProductByStoreId);

router.post("/store", storeController.create);
router.get("/store", storeController.findAll);
router.get("/store/:id", storeController.findOne);
router.put("/store", storeController.update);
router.delete("/store/:id", storeController.delete);
router.get("/my-store/:id", storeController.getStoreByuserId);

// Cart routes
router.post("/cart", userController.addToCart);
router.delete("/remove-cart", userController.removeFromCart);
router.post("/save-user-address", userController.saveAddress);
router.post("/order", userController.placeOrder);
router.get("/order-me/:id", userController.myOrder);
router.get("/order-merchant/:id", userController.merchantOrder);
router.post("/change-order-status", userController.changeStatus);
router.post("/analytics",userController.analytics);
//router.post("/productprices", productpricesController.create);
//router.get("/productprices", registerstoreController.findAll);
//router.get("/productprices/:id", registerstoreController.findOne);

router.get("/productprices", productpricesController.findAll);
router.get('/productprices/search', productpricesController.searchProductPrices);
router.get('/productprices/:id', productpricesController.findById);

/*
router.post("/slider",sliderController.create);
router.get("/slider",sliderController.findAll);
router.get("/slider/:id",sliderController.findOne);
router.put("/slider/:id",sliderController.update);
router.delete("/slider/:id",sliderController.delete);

router.post("/relateProduct", relateProductController.create);
router.delete("/relateProduct/:id", relateProductController.delete);
*/
/*
router.post("/rate-product", authenticationToken, async (req, res) => {
    try {
      const { id, rating } = req.body;
      let product = await Product.findById(id);
  
      for (let i = 0; i < product.ratings.length; i++) {
        if (product.ratings[i].userId == req.user) {
          product.ratings.splice(i, 1);
          break;
        }
      }
      const ratingSchema = {
        userId: req.user,
        rating,
      };
  
      product.ratings.push(ratingSchema);
      product = await product.save();
      res.json(product);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });*/

module.exports = router;
