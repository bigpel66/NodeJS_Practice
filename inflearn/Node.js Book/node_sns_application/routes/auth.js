const express = require('express');
const authController = require('../controller/auth');
const { isLoggedIn, isNotLoggedIn } = require('../controller/middlewares');

const router = express.Router();

router.post('/join', isNotLoggedIn, authController.postJoin);

router.post('/login', isNotLoggedIn, authController.postLogin);

router.get('/logout', isLoggedIn, authController.getLogout);

module.exports = router;
