const express = require('express');
const cors = require('cors');
const url = require('url');
const v2Controller = require('../controller/v2');
const { verifyToken, apiLimiter } = require('../controller/middlewares');
const { Domain } = require('../models/index');

const router = express.Router();

// MANUAL SETTINGS OF CORS
// router.use(cors('localhost:8082'));

// AUTOMATIC SETTING OF CORS
router.use(async (req, res, next) => {
    const domain = await Domain.findAll({
        where: { host: `http://${url.parse(req.get('origin')).host}` },
    });

    if (domain) {
        cors({ origin: domain[0].host })(req, res, next);
    } else {
        next();
    }
});

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
