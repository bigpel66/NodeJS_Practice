const http = require("http");

const express = require("express");

const app = express();

app.use((request, response, next) => {
  console.log("1번 동작");
  next();
});

app.use((requset, response, next) => {
  console.log("2번 동작");
});

const server = http.createServer(app);

server.listen(3000);
