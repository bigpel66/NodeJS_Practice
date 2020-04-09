// SEQUELIZE
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', 'Answpvnfdl99(', {
//     dialect: 'mysql',
//     host: 'localhost',
// });

// module.exports = sequelize;

// MONGODB
// const mongodb = require('mongodb');

// const MongoClient = mongodb.MongoClient;

// let db;

// const mongoConnect = (cb) => {
//     MongoClient.connect(
//         'mongodb+srv://bigpel66:JasonSeo@cluster0-2e6no.mongodb.net/shop?retryWrites=true&w=majority'
//     )
//         .then((client) => {
//             db = client.db();
//             cb();
//         })
//         .catch((error) => {
//             if (error) {
//                 console.log(error);
//                 throw error;
//             }
//         });
// };

// const getDb = () => {
//     if (db) {
//         return db;
//     }

//     throw 'No Database Found!';
// };

// module.exports.mongoConnect = mongoConnect;
// module.exports.getDb = getDb;
