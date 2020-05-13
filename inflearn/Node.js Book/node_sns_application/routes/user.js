const express = require('express');
const userController = require('../controller/user');
const { isLoggedIn } = require('../controller/middlewares');

const router = express.Router();

router.post('/profile', isLoggedIn, userController.postProfile);

router.post('/:id/follow', isLoggedIn, userController.postFollow);

router.post('/:id/unfollow', isLoggedIn, userController.postUnFollow);

module.exports = router;
