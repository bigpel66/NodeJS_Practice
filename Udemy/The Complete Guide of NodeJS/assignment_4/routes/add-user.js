const express = require("express");

const router = express.Router();

router
  .get("/add-user", (request, response, next) => {
    response.render();
  })
  .post("/add-user", (request, response, next) => {
    response.render();
  });

module.exports = router;
