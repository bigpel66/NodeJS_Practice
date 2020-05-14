const express = require('express');
const indexController = require('../controller/index');

const router = express.Router();

router.get('/', indexController.getMain);

router.get('/test', indexController.setHeader, indexController.getTest);

router.get(
    '/clientposts',
    indexController.setHeader,
    indexController.getClientPosts
);

router.get(
    '/hashtagposts/:hashtag',
    indexController.setHeader,
    indexController.getHashtagPosts
);

router.get(
    '/followlist',
    indexController.setHeader,
    indexController.getFollowList
);

module.exports = router;
