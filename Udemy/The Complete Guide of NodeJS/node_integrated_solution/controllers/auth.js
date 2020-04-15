const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const { validationResult } = require('express-validator/check');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: 'blocked',
        },
    })
);

module.exports.getLogin = (request, response, next) => {
    // const isLoggedIn =
    //     request.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';

    let errorMessage = request.flash('error');

    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    response.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errorMessage,
        prevInput: {
            email: '',
            password: '',
        },
        validationErrors: [],
    });
};

module.exports.postLogin = (request, response, next) => {
    // response.setHeader('Set-Cookie', 'loggedIn=true');

    const email = request.body.email;
    const password = request.body.password;

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            prevInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array(),
        });
    }

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                request.flash('error', 'USER INFO DOES NOT MATCH');
                return response.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'USER INFO DOES NOT MATCH',
                    prevInput: {
                        email: email,
                        password: password,
                    },
                    validationErrors: [
                        { param: 'email' },
                        { param: 'password' },
                    ],
                });
            }

            bcrypt
                .compare(password, user.password)
                .then((result) => {
                    if (result) {
                        request.session.isLoggedIn = true;
                        request.session.user = user;
                        return request.session.save((error) => {
                            if (error) {
                                console.log(error);
                            } else {
                                return response.redirect('/');
                            }
                        });
                    }
                    request.flash('error', 'USER INFO DOES NOT MATCH');
                    return response.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'USER INFO DOES NOT MATCH',
                        prevInput: {
                            email: email,
                            password: password,
                        },
                        validationErrors: [
                            { param: 'email' },
                            { param: 'password' },
                        ],
                    });
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                        response.redirect('/login');
                        throw error;
                    }
                });
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};

module.exports.postLogout = (request, response, next) => {
    request.session.destroy((error) => {
        if (error) {
            console.log(error);
            response.redirect('/');
        } else {
            response.redirect('/login');
        }
    });
};

module.exports.getSignUp = (request, response, next) => {
    let errorMessage = request.flash('error');

    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    response.render('auth/signup', {
        pageTitle: 'Sign Up',
        path: '/signup',
        errorMessage: errorMessage,
        prevInput: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationErrors: [],
    });
};

module.exports.postSignUp = (request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(422).render('auth/signup', {
            pageTitle: 'Sign Up',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            prevInput: {
                email: email,
                password: password,
                confirmPassword: request.body.confirmPassword,
            },
            validationErrors: errors.array(),
        });
    }

    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const newUser = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] },
            });

            return newUser.save();
        })
        .then((result) => {
            response.redirect('/login');

            transporter
                .sendMail({
                    to: email,
                    from: 'bigpel66@gmail.com',
                    subject: 'Congratulations! Sign Up Succeeded!',
                    html: '<h1>You successfully signed up!</h1>',
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                    }
                });
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};

module.exports.getReset = (request, response, next) => {
    let errorMessage = request.flash('error');

    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    response.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: errorMessage,
    });
};

module.exports.postReset = (request, response, next) => {
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            console.log(error);
            return response.redirect('/reset');
        }

        const token = buffer.toString('hex');

        User.findOne({ email: request.body.email })
            .then((user) => {
                if (!user) {
                    request.flash('error', 'No Matched User');
                    return response.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 360000;

                return user.save();
            })
            .then((result) => {
                response.redirect('/login');

                transporter.sendMail({
                    to: request.body.email,
                    from: 'bigpel66@gmail.com',
                    subject: 'Password Reset',
                    html: `
                    <p>You requested a password reset!</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `,
                });
            })
            .catch((err) => {
                if (err) {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                }
            });
    });
};

module.exports.getNewPassword = (request, response, next) => {
    const token = request.params.token;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
    })
        .then((user) => {
            if (user) {
                let errorMessage = request.flash('error');

                if (errorMessage.length > 0) {
                    errorMessage = errorMessage[0];
                } else {
                    errorMessage = null;
                }

                response.render('auth/new-password', {
                    pageTitle: 'New Password',
                    path: '/new-password',
                    errorMessage: errorMessage,
                    token: token,
                    userId: user._id.toString(),
                });
            }
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};

module.exports.postNewPassword = (request, response, next) => {
    const userId = request.body.userId;
    const newPassword = request.body.password;
    const token = request.body.token;

    let resetUser;

    User.findOne({
        _id: userId,
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
    })
        .then((user) => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then((hashedPassword) => {
            resetUser.password = hashedPassword;

            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = null;

            return resetUser.save();
        })
        .then((result) => {
            return response.redirect('/login');
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};
