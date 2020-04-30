// TESTING CHECKING AUTH MIDDLEWARE
// const expect = require('chai').expect;
// const jwt = require('jsonwebtoken');
// const sinon = require('sinon');

// const authMiddleware = require('../middleware/is-auth');

// describe('Auth Middleware', function () {
//     it('should throw an error if no authorization header is present', function () {
//         const request = {
//             get: function (headerName) {
//                 return null;
//             },
//         };

//         expect(authMiddleware.bind(this, request, {}, () => {})).to.throw(
//             'Not authenticated.'
//         );
//     });

//     it('should throw an error if the authorization header is only one stinrg', function () {
//         const request = {
//             get: function (headerName) {
//                 return 'xyz';
//             },
//         };

//         expect(authMiddleware.bind(this, request, {}, () => {})).to.throw();
//     });

//     it('should yield a userId after decoding the token', function () {
//         const request = {
//             get: function () {
//                 return 'Bearer randomStringBBMQRYUDNGVFMCXSHURTYWMEPLXKYDRFKJEGFTGSJDLXAGPYQREORQMANUBBAIDZMMFCANFHQTQZMQMLWNLZDSDTMWNTKGHKVJLH';
//             },
//         };

//         // MANUAL OVERRIDNG, NOT RECOMMENDED, USE SINON
//         // jwt.verify = function () {
//         //     return { userId: 'abc' };
//         // };

//         // STUB METHOD OF SINON
//         sinon.stub(jwt, 'verify');
//         jwt.verify.returns({ userId: 'abc' });

//         authMiddleware(request, {}, () => {});

//         expect(request).to.have.property('userId');
//         expect(request).to.have.property('userId', 'abc');
//         expect(jwt.verify.called).to.true;
//         jwt.verify.restore();
//     });

//     it('should throw an error if the token cannot be verified', function () {
//         const request = {
//             get: function () {
//                 return 'Bearer xyz';
//             },
//         };

//         expect(authMiddleware.bind(this, request, {}, () => {})).to.throw();
//     });
// });
