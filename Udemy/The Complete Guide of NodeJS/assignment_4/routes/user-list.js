const express = require("express");

const router = express();

router.get("/users", (request, response, next) => {
  response.render();
});

module.exports = router;
