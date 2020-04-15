const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router
    .get('/login', authController.getLogin)
    .post(
        '/login',
        [
            body('email')
                .isEmail()
                .withMessage('Please Enter a Valid Email')
                .normalizeEmail(),
            body(
                'password',
                'Please Enter a Password with Only Numbers and Text and At Least 5 Characters'
            )
                .isLength({ min: 5 })
                .isAlphanumeric()
                .trim(),
        ],
        authController.postLogin
    );

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignUp).post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please Enter a Valid Email')
            .custom((val, { req }) => {
                return User.findOne({ email: val }).then((user) => {
                    if (user) {
                        return Promise.reject('Duplicated Email');
                    }
                });
            })
            .normalizeEmail(),
        body(
            'password',
            'Please Enter a Password with Only Numbers and Text and At Least 5 Characters'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((val, { req }) => {
                if (val !== req.body.password) {
                    throw new Error('Passwords Have to Match');
                }

                return true;
            })
            .trim(),
    ],
    authController.postSignUp
);

router
    .get('/reset', authController.getReset)
    .post('/reset', authController.postReset);

router
    .get('/reset/:token', authController.getNewPassword)
    .post('/reset/:token', authController.postNewPassword);

module.exports = router;
