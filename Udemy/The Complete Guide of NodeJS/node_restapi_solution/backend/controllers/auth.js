// REST API
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const { validationResult } = require('express-validator/check');

// const User = require('../models/user');

// module.exports.signup = async (request, response, next) => {
//     const errors = validationResult(request);

//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed.');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }

//     const email = request.body.email;
//     const name = request.body.name;
//     const password = request.body.password;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 12);

//         const user = new User({
//             email: email,
//             password: hashedPassword,
//             name: name,
//         });

//         const resultUser = await user.save();

//         response
//             .status(201)
//             .json({ message: 'User created!', userId: resultUser._id });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// };

// module.exports.login = async (request, response, next) => {
//     const email = request.body.email;
//     const password = request.body.password;

//     try {
//         const user = await User.findOne({ email: email });

//         if (!user) {
//             const error = new Error(
//                 'A user with this email could not be found.'
//             );
//             error.statusCode = 401;
//             throw error;
//         }

//         const result = await bcrypt.compare(password, user.password);

//         if (!result) {
//             const error = new Error('Wrong password!');
//             error.statusCode = 401;
//             throw error;
//         }

//         const token = jwt.sign(
//             {
//                 email: user.email,
//                 userId: user._id.toString(),
//             },
//             'MySecret',
//             { expiresIn: '1h' }
//         );

//         response
//             .status(200)
//             .json({ token: token, userId: user._id.toString() });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// };

// module.exports.readStatus = async (request, response, next) => {
//     try {
//         const user = await User.findById(request.userId);

//         if (!user) {
//             const error = new Error('No user found.');
//             error.statusCode = 404;
//             throw error;
//         }

//         response.status(200).json({ status: user.status });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// };

// module.exports.updateStatus = async (request, response, next) => {
//     const newStatus = request.body.status;

//     try {
//         const user = await User.findById(request.userId);

//         if (!user) {
//             const error = new Error('No user found.');
//             error.statusCode = 404;
//             throw error;
//         }

//         user.status = newStatus;

//         await user.save();

//         response.status(200).json({ message: 'User status updated.' });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     }
// };
