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

    addToCart(product) {
        // const existingProductIndex = this.cart.items.findIndex((item) => {
        //     return item._id === product._id;
        // });

        const updatedCart = {
            items: [{ productId: product._id, quantity: 1 }],
        };
        const db = getDb();
        return db
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
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
