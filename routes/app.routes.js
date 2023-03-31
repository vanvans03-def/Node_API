const categoryController = require("../controllers/categories.controllers");
const userController = require("../controllers/users.controller");
const productController = require("../controllers/products.controller");
const registerstoreController = require("../controllers/registerstore.controller");
const sliderController = require("../controllers/slider.controller");
const relatedProductController = require("../controllers/related-product.controller")
const express = require("express");
const router = express.Router();
const {authenticationToken}  = require("../middleware/auth");
const Product  = require("../models/product.model");

router.post("/category",categoryController.create);
router.get("/category",categoryController.findAll);
router.get("/category/:id",categoryController.findOne);
router.put("/category/:id",categoryController.update);
router.delete("/category/:id",categoryController.delete);

router.post("/register",userController.register);
router.post("/login",userController.login);


router.get('/product/search/:productName', productController.searchProduct);
router.post("/product",productController.create);
router.get("/product",productController.findAll);
router.get("/product/:id",productController.findOne);
router.put("/product/:id",productController.update);
router.delete("/product/:id",productController.delete);
router.post("/rate-product", authenticationToken, productController.rateProduct);
  

router.post("/registerstore",registerstoreController.create);
router.get("/registerstore",registerstoreController.findAll);
router.get("/registerstore/:id",registerstoreController.findOne);
router.put("/registerstore/:id",registerstoreController.update);
router.delete("/registerstore/:id",registerstoreController.delete);

// Cart routes
router.post('/cart', userController.addToCart);
router.delete('/cart/:email',userController.removeFromCart)


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