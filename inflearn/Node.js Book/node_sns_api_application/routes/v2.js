const express = require('express');
const v2Controller = require('../controller/v2');
const { verifyToken, apiLimiter } = require('../controller/middlewares');

const router = express.Router();

router.post('/token', apiLimiter, v2Controller.postToken);

router.get('/test', apiLimiter, verifyToken, v2Controller.getTest);

router.get(
    '/client/posts',
    apiLimiter,
    verifyToken,
    v2Controller.getClientPosts
);

router.get(
    '/hashtag/:title/posts',
    apiLimiter,
    verifyToken,
    v2Controller.getHashtagPosts
);

router.get('/follow', apiLimiter, verifyToken, v2Controller.getFollow);

module.exports = router;
