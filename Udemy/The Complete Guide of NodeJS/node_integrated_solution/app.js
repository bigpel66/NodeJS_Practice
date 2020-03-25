const express = require("express");

const app = express();

app.use((request, response, next) => {
  console.log("1번 동작");
  next();
});

app.use((requset, response, next) => {
  console.log("2번 동작");
  response.send('<h1>Hello from Express</h1>');
});

app.listen(3000);