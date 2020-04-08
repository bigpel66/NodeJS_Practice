const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// SEQUELIZE MODELS
// const sequelize = require('./helpers/database');

// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

const mongoConnect = require('./helpers/database').mongoConnect;

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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

app.use((request, response, next) => {
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

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

mongoConnect(() => {
    app.listen(3000);
});
