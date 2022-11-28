const categoryController = require("../controllers/categories.controllers");
const userController = require("../controllers/users.controller");
const express = require("express");
const router = express.Router();

router.post("/category",categoryController.create);
router.get("/category",categoryController.findAll);
router.get("/category/:id",categoryController.findOne);
router.put("/category/:id",categoryController.update);
router.delete("/category/:id",categoryController.delete);

router.post("/register",userController.register);
router.post("/login",userController.login);



module.exports = router;