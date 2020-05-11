const express = require('express');
const indexController = require('../controller/index');
const { isLoggedIn, isNotLoggedIn } = require('../controller/middlewares');

const router = express.Router();

router.get('/profile', isLoggedIn, indexController.getProfile);

router.get('/join', isNotLoggedIn, indexController.getJoin);

router.get('/', indexController.getMain);

module.exports = router;
