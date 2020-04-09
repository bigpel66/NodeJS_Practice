// SEQUELIZE
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

const mongodb = require('mongodb');
const getDb = require('../helpers/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();

        return db
            .collection('users')
            .insertOne(this)
            .then((result) => {})
            .catch((error) => {
                if (error) {
                    console.log(error);
                }
            });
    }

    getCart() {
        const db = getDb();

        const productIds = this.cart.items.map((item) => {
            return item.productId;
        });

        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then((products) => {
                return products.map((product) => {
                    return {
                        ...product,
                        quantity: this.cart.items.find((item) => {
                            return (
                                item.productId.toString() ===
                                product._id.toString()
                            );
                        }).quantity,
                    };
                });
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                }
            });
    }

    addToCart(product) {
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

        const db = getDb();
        return db
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    }

    deleteItemFromCart(productId) {
        const existingProducts = this.cart.items.filter((item) => {
            return item.productId.toString() !== productId.toString();
        });

        const db = getDb();

        return db
            .collection('users')
            .updateOne(
                { _id: this._id },
                { $set: { cart: { items: existingProducts } } }
            );
    }

    static findById(userId) {
        const db = getDb();

        return db
            .collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then((user) => {
                return user;
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                }
            });
    }
}

module.exports = User;
