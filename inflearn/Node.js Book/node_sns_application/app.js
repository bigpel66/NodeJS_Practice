const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const { sequelize } = require('./models/index');

const app = express();

sequelize.sync();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('snsapplication'));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: 'snsapplication',
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
