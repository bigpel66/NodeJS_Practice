const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const multer = require('multer');

// SEQUELIZE MODELS
// const sequelize = require('./helpers/database');

// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

// MONGODB CONNECTOR
// const mongoConnect = require('./helpers/database').mongoConnect;

// const User = require('./models/user');

const MONGODB_URI =
    'mongodb+srv://bigpel66:JasonSeo@cluster0-2e6no.mongodb.net/shop?retryWrites=true&w=majority';

const mongoose = require('mongoose');
const User = require('./models/user');

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

const csurf = require('csurf');
const csurfProtection = csurf();

const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'images');
    },
    filename: (request, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single('image'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(csurfProtection);

app.use(flash());

app.use((request, response, next) => {
    response.locals.isLoggedIn = request.session.isLoggedIn;
    response.locals.csrfToken = request.csrfToken();
    next();
});

app.use((request, response, next) => {
    if (!request.session.user) {
        return next();
    }

    User.findById(request.session.user._id)
        .then((user) => {
            if (!user) {
                return next();
            }
            request.user = user;
            next();
        })
        .catch((err) => {
            if (err) {
                next(new Error(err));
            }
        });
});

// app.use((request, response, next) => {
//     request.session.user = new User().init(request.session.user);
//     next();
// });

// SEQUELIZE USER IN REQUEST
// app.use((request, response, next) => {
//     User.findByPk(1)
//         .then((user) => {
//             request.user = user;
//             next();
//         })
//         .catch((error) => {
//             if (error) {
//                 console.log(error);
//             }
//         });
// });

// MONGODB USER IN REQUEST
// app.use((request, response, next) => {
//     User.findById('5e8dd5a409c4a2179d90a37a')
//         .then((user) => {
//             request.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch((error) => {
//             if (error) {
//                 console.log(error);
//             }
//         });
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).render('500', {
        path: '/500',
        pageTitle: 'Error!',
        isLoggedIn: request.session.isLoggedIn,
    });
});

// SEQUELIZE ASSOCIATION
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// Cart.belongsTo(User);
// User.hasOne(Cart);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });

// SEQUELIZE SYNC
// sequelize
//     .sync()
//     // .sync({ force: true })
//     .then((results) => {
//         return User.findByPk(1);
//     })
//     .then((user) => {
//         if (!user) {
//             return User.create({ name: 'Jason', email: 'bigpel66@gmail.com' });
//         }
//         return user;
//     })
//     .then(async (user) => {
//         if (!(await user.getCart())) {
//             return user.createCart();
//         }

//         return user.getCart();
//     })
//     .then((cart) => {
//         app.listen(3000);
//     })
//     .catch((error) => {
//         if (error) {
//             console.log(error);
//         }
//     });

// MONGODB CONNECT
// mongoConnect(() => {
//     app.listen(3000);
// });

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        app.listen(3000);
    })
    .catch((error) => {
        if (error) {
            console.log(error);
        }
    });
