const User = require('../models/user');

const { validationResult } = require('express-validator/check');

module.exports.signup = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errros.array();
        throw error;
    }

    const email = request.body.email;
    const name = request.body.name;
    const password = requets.body.password;
};
