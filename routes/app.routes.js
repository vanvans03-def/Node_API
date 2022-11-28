const categoryController = require("../controllers/categories.controllers");
const express = require("express");
const router = express.Router();

router.post("/category",categoryController.create);
router.get("/category",categoryController.findAll);
router.get("/category/:id",categoryController.findOne);
router.put("/category/:id",categoryController.update);
router.delete("/category/:id",categoryController.delete);

router.post("/product",categoryController.create);
router.get("/product",categoryController.findAll);
router.get("/product/:id",categoryController.findOne);
router.put("/product/:id",categoryController.update);
router.delete("/product/:id",categoryController.delete);

module.exports = router;