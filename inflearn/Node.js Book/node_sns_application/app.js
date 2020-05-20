const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

// GLOBAL MULTER
// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename(req, file, cb) {
//         cb(
//             null,
//             path.basename(file.originalname, extname) +
//                 new Date().valueOf() +
//                 extname
//         );
//     },
// });
// const fileFilter = (req, file, cb) => {
//     if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 },
// });

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const { sequelize } = require('./models/index');
const passportConfig = require('./passport/index');
const logger = require('./logger');

logger.info('logging');
logger.error('error');

require('dotenv').config();

const app = express();

const redisClient = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_HOST
);

const redisConnectionResult = redisClient.auth(
    process.env.REDIS_PASSWORD,
    (err) => {
        if (err) {
            console.log(err);
        }
    }
);

console.log('redis connection with client: ', redisConnectionResult);

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({
        client: redisClient,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASSWORD,
        logErrors: true,
    }),
};

if (process.env.NODE_ENV === 'production') {
    // ACTIVATE WHEN IT HAS TO BE USED
    // sessionOption.proxy = true;
    // sessionOption.cookie.secure = true;
}

sequelize.sync();
passportConfig(passport);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 8080);

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// GLOBAL MULTER MIDDLEWARE
// app.use(upload.single('img'));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found 404');
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
    console.log(`Start Server with ${app.get('port')}!`);
});
