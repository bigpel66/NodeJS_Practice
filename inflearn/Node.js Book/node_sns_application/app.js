const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

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

require('dotenv').config();

const app = express();

sequelize.sync();
passportConfig(passport);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// GLOBAL MULTER MIDDLEWARE
// app.use(upload.single('img'));

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

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);

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
