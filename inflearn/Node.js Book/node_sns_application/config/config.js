require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DEV_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: 0,
        logging: false,
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_TEST_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: 0,
        logging: false,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_PRODUCTION_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: 0,
        logging: false,
    },
};
