// SEQUELIZE PRODUCT
// const Sequelize = require('sequelize');

// const sequelize = require('../helpers/database');

// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     title: { type: Sequelize.STRING, allowNull: false },
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false,
//     },
//     imageUrl: { type: Sequelize.STRING, allowNull: false },
//     description: { type: Sequelize.STRING, allowNull: false },
// });

// module.exports = Product;

const mongodb = require('mongodb');
const getDb = require('../helpers/database').getDb;

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        return db
            .collection('products')
            .insertOne(this)
            .then((results) => {})
            .catch((error) => {
                if (error) {
                    console.log(error);
                }
            });
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then((products) => {
                return products;
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                }
            });
    }

    static findById(productId) {
        const db = getDb();
        return db
            .collection('products')
            .find({ _id: new mongodb.ObjectId(productId) })
            .next()
            .then((product) => {
                return product;
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                }
            });
    }
}

module.exports = Product;
