const path = require("path");

const express = require("express");

const router = express.Router();

router.get("/", (request, response, next) => {
  response.sendFile(
    path.join(path.dirname(process.mainModule.filename), "views", "index.html")
  );
});

router.get("/users", (request, response, next) => {
  response.sendFile(
    path.join(path.dirname(process.mainModule.filename), "views", "users.html")
  );
});

module.exports = router;
