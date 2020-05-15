const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const webSocket = require('./socket');
const indexRouter = require('./routes/index');

const app = express();

require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8080);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
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

app.use('/', indexRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(app.get('port'), () => {
    console.log(`Server Running on ${app.get('port')}!`);
});

const connect = async () => {
    try {
        mongoose.set('debug', false);

        await mongoose.connect(process.env.MONGO_URL);

        mongoose.connection.on('error', (err) => {
            console.error('MONGO DB ERROR', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.error('MONGO DB DISCONNECTED\nRETRYING TO CONNECT');
            connect();
        });

        require('./schemas/room');
        require('./schemas/chat');

        webSocket(server);
    } catch (err) {
        console.error(err);
    }
};

connect();
