const mongoose = require('mongoose');
const { url } = require('../config/config.json');

const connect = async () => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB Connection Succeed');
    } catch (err) {
        console.log('MongoDB Connection Failed');
        throw err;
    }
};

module.exports = async () => {
    await connect();

    mongoose.connection.on('error', (err) => {
        console.error(err);
    });
    mongoose.connection.on('disconnected', async () => {
        console.error('MongoDB Disconnected');
        await connect();
    });

    require('./user');
    require('./comment');
};
