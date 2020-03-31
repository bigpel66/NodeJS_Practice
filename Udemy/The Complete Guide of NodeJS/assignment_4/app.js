const express = require("express");
const expressHbs = require("express-handlebars");

const app = express();

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts",
    defaultLayout: "main-layout",
    extname: "hbs"
  })
);

app.set("view engine", "pug");
app.set("veiw engine", "hbs");
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (request, response, next) => {
  response.render();
});

app.get("/users", (request, response, next) => {
  response.render();
});

app.post("/add-user", (request, response, next) => {
  response.redirect("/");
});

app.listen(3000);
