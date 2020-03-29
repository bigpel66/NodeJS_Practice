const path = require("path");

const express = require("express");

const rootDir = require("../helpers/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (request, response, next) => {
  console.log(adminData.products);
  response.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
