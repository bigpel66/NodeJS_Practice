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
    constructor(name, email) {
        this.name = name;
        this.email = email;
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
