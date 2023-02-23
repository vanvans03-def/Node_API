const categoryController = require("../controllers/categories.controllers");
const userController = require("../controllers/users.controller");
const productController = require("../controllers/products.controller");
const registerstoreController = require("../controllers/registerstore.controller");
const sliderController = require("../controllers/slider.controller");
const relatedProductController = require("../controllers/related-product.controller")
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.post("/category",categoryController.create);
router.get("/category",categoryController.findAll);
router.get("/category/:id",categoryController.findOne);
router.put("/category/:id",categoryController.update);
router.delete("/category/:id",categoryController.delete);

router.post("/register",userController.register);
router.post("/login",userController.login);



router.post("/product",productController.create);
router.get("/product",productController.findAll);
router.get("/product/:id",productController.findOne);
router.put("/product/:id",productController.update);
router.delete("/product/:id",productController.delete);



router.post("/registerstore",registerstoreController.create);
router.get("/registerstore",registerstoreController.findAll);
router.get("/registerstore/:id",registerstoreController.findOne);
router.put("/registerstore/:id",registerstoreController.update);
router.delete("/registerstore/:id",registerstoreController.delete);

 
 

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