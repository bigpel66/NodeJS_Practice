const path = require("path");

const express = require("express");

const rootDir = require("../helpers/path");

const router = express.Router();

const products = [];

// /admin/add-product
router
  .get("/add-product", (requset, response, next) => {
    response.render("add-product", {
      path: "/admin/add-product",
      pageTitle: "Add-Product",
      activeAddProduct: true,
      productCSS: true,
      formsCSS: true
    });
  })
  .post("/add-product", (request, response, next) => {
    products.push({ title: request.body.title });
    response.redirect("/");
  });

module.exports.router = router;
module.exports.products = products;
