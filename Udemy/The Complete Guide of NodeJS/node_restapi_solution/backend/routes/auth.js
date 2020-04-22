const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((val, { req }) => {
                return User.findOne({ email: val })
                    .then((user) => {
                        if (user) {
                            return Promise.reject(
                                'E-mail address already exists!'
                            );
                        }
                    })
                    .catch((err) => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    });
            })
            .normalizeEmail(),
        body('password').trim().isLength({ min: 5 }),
        body('name').trim().not().isEmpty(),
    ],
    authController.signup
);

router.post('/login', authController.login);

module.exports = router;
