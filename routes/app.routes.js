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
const chatController = require("../controllers/chat.controller");


router.post('/chat',chatController.loadChatFromDatabase );
router.get('/chat-byUID/',chatController.getChatByUID );

router.get("/province", provinceController.findAll);
router.post("/provinceNearMe",provinceController.getProvinceNearMe);
router.post("/generateQR", userController.generateQR);


router.post("/filter-product",productController.filterProduct);
router.post("/category", categoryController.create);
router.get("/category", categoryController.findAll);
router.get("/category/:id", categoryController.findOne);
router.put("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.delete);

router.get("/getUserData/:id",userController.getUserData);
router.post("/updateUserData/",userController.updateUserData);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/registerOauth",userController.registerOauth);

router.get("/product/search/", productController.searchProduct);
router.post("/product", productController.create);
router.get("/product", productController.findAll);
router.get("/product/:id", productController.findOne);
router.put("/product/:id", productController.update);
router.delete("/product/:id", productController.delete);
router.post("/rate-product",productController.rateProduct);
router.get('/product/store/:storeId',productController.getProductByStoreId);
router.get('/deal-of-day', productController.getDealOfDay);


router.get("/store/search/", storeController.searchStore);
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
router.post("/analyticsByDate",userController.analyticsByDate);
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


module.exports = router;
