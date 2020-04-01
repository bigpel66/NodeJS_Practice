// const path = require("path");

const express = require("express");

// const rootDir = require("../helpers/path");
const productsController = require("../controllers/products");

const router = express.Router();

// /admin/add-product
router
    .get("/add-product", productsController.getAddProduct)
    .post("/add-product", productsController.postAddProduct);

module.exports = router;
