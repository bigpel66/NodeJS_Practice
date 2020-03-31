const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const mainRoute = require("./routes/main");
const rootRoute = require("./routes/add-user");
const usersRoute = require("./routes/user-list");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.engine("hbs", expressHbs());

app.set("view engine", "pug");
app.set("veiw engine", "hbs");
app.set("view engine", "ejs");
app.set("views", "views");

app.use(mainRoute);
app.use(rootRoute);
app.use(usersRoute);

app.use((reques, response, next) => {
  response.statusCode(404).render();
});

app.listen(3000);
