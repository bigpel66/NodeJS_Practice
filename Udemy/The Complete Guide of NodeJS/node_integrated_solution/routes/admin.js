const path = require("path");

const express = require("express");

const rootDir = require("../helpers/path");

const router = express.Router();

// /admin/add-product
router
  .get("/add-product", (requset, response, next) => {
    response.sendFile(path.join(rootDir, "views", "add-product.html"));
  })
  .post("/add-product", (request, response, next) => {
    console.log(request.body);
    response.redirect("/");
  });

module.exports = router;
