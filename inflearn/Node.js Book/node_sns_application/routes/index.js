const express = require('express');
const indexController = require('../controller/index');

const router = express.Router();

router.get('/profile', indexController.getProfile);

router.get('/join', indexController.getJoin);

router.get('/', indexController.getMain);

module.exports = router;
