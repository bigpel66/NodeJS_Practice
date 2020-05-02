// TESTING AUTH CONTROLLER
// const expect = require('chai').expect;
// const sinon = require('sinon');
// const mongoose = require('mongoose');

// const User = require('../models/user');
// const AuthContorller = require('../controllers/auth');

// const env = require('../env.json');

// // NOT USING TESTING DATABASE METHOD, NOT RECOMMENDED
// // describe('Auth Controller - Login', function () {
// //     it('should throw an error if accessing the database fails', function (done) {
// //         sinon.stub(User, 'findOne');
// //         User.findOne.throws();

// //         const request = {
// //             body: {
// //                 email: 'test@test.com',
// //                 password: 'tester',
// //             },
// //         };

// //         AuthContorller.login(request, {}, () => {})
// //             .then((result) => {
// //                 expect(result).to.be.an('error');
// //                 expect(result).to.have.property('statusCode', 500);
// //                 done();
// //             })
// //             .catch((err) => {
// //                 if (!err.statusCode) {
// //                 }
// //             });

// //         User.findOne.restore();
// //     });
// // });

// // USING TESTING DATABASE, SPENDING MORE TIME BUT GOOD WAY
// describe('Auth Controller - Status', function () {
//     before(function (done) {
//         mongoose
//             .connect(env.MONGO_URL)
//             .then((result) => {
//                 const user = new User({
//                     _id: '5eaa89b07e08665c78fb6a2b',
//                     email: 'test@test.com',
//                     name: 'tester',
//                     password: 'tester',
//                     posts: [],
//                 });

//                 return user.save();
//             })
//             .then(() => {
//                 done();
//             });
//     });

//     after(function (done) {
//         User.deleteMany({})
//         .then(() => {
//             return mongoose.disconnect();
//         })
//         .then(() => {
//             done();
//         });
//     });

//     it('should send a response with a valid user status for existing user', function (done) {
//         const request = {
//             userId: '5eaa89b07e08665c78fb6a2b',
//         };

//         const response = {
//             statusCode: 500,
//             userStatus: null,
//             status: function (code) {
//                 this.statusCode = code;
//                 return this;
//             },
//             json: function (data) {
//                 this.userStatus = data.status;
//             },
//         };

//         AuthContorller.getUserStatus(request, response, () => {}).then(() => {
//             expect(response.statusCode).to.be.equal(200);
//             expect(response.userStatus).to.be.equal('I am new!');
//             done();
//         });
//     });
// });
