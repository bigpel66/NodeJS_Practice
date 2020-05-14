const express = require('express');
const axios = require('axios');
const indexController = require('../controller/index');

const router = express.Router();

axios.defaults.headers.origin = process.env.ORIGIN_URL

router.get('/', indexController.getMain);

router.get('/test', indexController.getTest);

router.get('/clientposts', indexController.getClientPosts);

router.get('/hashtagposts/:hashtag', indexController.getHashtagPosts);

router.get('/followlist', indexController.getFollowList);

module.exports = router;
