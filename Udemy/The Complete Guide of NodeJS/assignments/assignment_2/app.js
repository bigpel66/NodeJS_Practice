const express = require("express");

const app = express();

// app.use((request, response, next) => {
//   console.log("activation: 1");
//   next();
// });

// app.use((request, response, next) => {
//   console.log("activation: 2");
//   response.send("<p>Assignment almost solved!</p>");
// });

app.use("/users", (request, response, next) => {
  console.log("activation: 4");
  response.send("<p>Dummy Users</p>");
});

app.use("/", (request, response, next) => {
  console.log("activation: 3");
  response.send("<p>Main Page</p>");
});

app.listen(3000);
