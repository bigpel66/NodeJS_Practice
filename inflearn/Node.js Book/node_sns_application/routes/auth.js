const express = require('express');
const passport = require('passport');
const authController = require('../controller/auth');
const { isLoggedIn, isNotLoggedIn } = require('../controller/middlewares');

const router = express.Router();

router.post('/join', isNotLoggedIn, authController.postJoin);

router.post('/login', isNotLoggedIn, authController.postLogin);

router.get('/logout', isLoggedIn, authController.getLogout);

router.get('/kakao', authController.getKakao);

router.get('/kakao/callback', authController.getKakaoCallback);

module.exports = router;
