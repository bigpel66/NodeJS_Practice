const express = require('express');
const userController = require('../controller/user');
const { isLoggedIn } = require('../controller/middlewares');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, userController.postFollow);

module.exports = router;
