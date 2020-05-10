const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const { sequelize } = require('./models/index');

require('dotenv').config();

const app = express();

sequelize.sync();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
);
app.use(flash());

app.listen(app.get('port'), () => {
    console.log(`Start Server with ${app.get('port')}!`);
});
