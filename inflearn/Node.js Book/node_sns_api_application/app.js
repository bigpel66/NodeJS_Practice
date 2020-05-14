const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportConfig = require('./passport/index');
const { sequelize } = require('./models/index');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const v1Router = require('./routes/v1');
const v2Router = require('./routes/v2');

require('dotenv').config();
sequelize.sync();
passportConfig(passport);

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 8081);

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

app.use(passport.initialize());
app.use(passport.session());

app.use('/v2', v2Router);
app.use('/v1', v1Router);
app.use('/auth', authRouter);
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

app.listen(app.get('port'), () => {
    console.log(`API Server Running on ${app.get('port')}!`);
});
