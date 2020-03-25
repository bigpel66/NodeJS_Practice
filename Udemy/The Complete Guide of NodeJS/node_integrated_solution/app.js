const express = require("express");

const app = express();

app.use("/", (request, response, next) => {
  console.log("called");
  next();
});

app.use("/add-product", (requset, response, next) => {
  response.send('<h1>The "Add" Product</h1>');
});

app.use("/", (request, response, next) => {
  response.send("<h1>Hello from Express</h1>");
});

app.listen(3000);
