// SEQUELIZE USER
// const Sequelize = require('sequelize');

// const sequelize = require('../helpers/database');

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     name: Sequelize.STRING,
//     email: Sequelize.STRING,
// });

// module.exports = User;

// MONGODB USER
// const mongodb = require('mongodb');
// const getDb = require('../helpers/database').getDb;

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//     }

//     save() {
//         const db = getDb();

//         return db
//             .collection('users')
//             .insertOne(this)
//             .then((result) => {})
//             .catch((error) => {
//                 if (error) {
//                     console.log(error);
//                 }
//             });
//     }

//     getCart() {
//         const db = getDb();

//         const productIds = this.cart.items.map((item) => {
//             return item.productId;
//         });

//         return db
//             .collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then((products) => {
//                 return products.map((product) => {
//                     return {
//                         ...product,
//                         quantity: this.cart.items.find((item) => {
//                             return (
//                                 item.productId.toString() ===
//                                 product._id.toString()
//                             );
//                         }).quantity,
//                     };
//                 });
//             })
//             .catch((error) => {
//                 if (error) {
//                     console.log(error);
//                 }
//             });
//     }

//     addToCart(product) {
//         const existingProductIndex = this.cart.items.findIndex((item) => {
//             return item.productId.toString() === product._id.toString();
//         });

//         let newQuantity = 1;

//         const existingProducts = [...this.cart.items];

//         if (existingProductIndex >= 0) {
//             newQuantity = existingProducts[existingProductIndex].quantity + 1;
//             existingProducts[existingProductIndex].quantity = newQuantity;
//         } else {
//             existingProducts.push({
//                 productId: product._id,
//                 quantity: newQuantity,
//             });
//         }

//         const updatedCart = { items: existingProducts };

//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//     }

//     deleteItemFromCart(productId) {
//         const existingProducts = this.cart.items.filter((item) => {
//             return item.productId.toString() !== productId.toString();
//         });

//         const db = getDb();

//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: this._id },
//                 { $set: { cart: { items: existingProducts } } }
//             );
//     }

//     addOrder() {
//         const db = getDb();

//         return this.getCart()
//             .then((products) => {
//                 const order = {
//                     items: products,
//                     user: {
//                         id: this._id,
//                         name: this.name,
//                     },
//                 };

//                 return db.collection('orders').insertOne(order);
//             })
//             .then((result) => {
//                 this.cart = { items: [] };

//                 return db
//                     .collection('users')
//                     .updateOne(
//                         { _id: this._id },
//                         { $set: { cart: this.cart } }
//                     );
//             })
//             .catch((error) => {
//                 if (error) {
//                     console.log(error);
//                 }
//             });
//     }

//     getOrders() {
//         const db = getDb();

//         return db
//             .collection('orders')
//             .find({ 'user.id': this._id })
//             .toArray()
//             .then((orders) => {
//                 return orders;
//             })
//             .catch((error) => {
//                 if (error) {
//                     console.log(error);
//                 }
//             });
//     }

//     static findById(userId) {
//         const db = getDb();

//         return db
//             .collection('users')
//             .findOne({ _id: new mongodb.ObjectId(userId) })
//             .then((user) => {
//                 return user;
//             })
//             .catch((error) => {
//                 if (error) {
//                     console.log(error);
//                 }
//             });
//     }
// }

// module.exports = User;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, required: true },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: { type: Number, required: true },
            },
        ],
    },
});

userSchema.methods.addToCart = function (product) {
    const existingProductIndex = this.cart.items.findIndex((item) => {
        return item.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const existingProducts = [...this.cart.items];

    if (existingProductIndex >= 0) {
        newQuantity = existingProducts[existingProductIndex].quantity + 1;
        existingProducts[existingProductIndex].quantity = newQuantity;
    } else {
        existingProducts.push({
            productId: product._id,
            quantity: newQuantity,
        });
    }

    const updatedCart = { items: existingProducts };

    this.cart = updatedCart;

    return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
    const existingProducts = this.cart.items.filter((item) => {
        console.log(item.productId.toString());
        console.log(productId.toString());
        return item.productId.toString() !== productId.toString();
    });

    this.cart.items = existingProducts;

    return this.save();
};

module.exports = mongoose.model('User', userSchema);
