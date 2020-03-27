const express = require("express");

const router = express.Router();

// /admin/add-product
router
  .get("/add-product", (requset, response, next) => {
    response.send(
      '<html><body><form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></input></form></body></html>'
    );
  })
  .post("/add-product", (request, response, next) => {
    console.log(request.body);
    response.redirect("/");
  });

module.exports = router;
