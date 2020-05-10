const express = require('express');
const indexController = require('../controller/index');

const router = express.Router();

router.get('/', indexController.getMain);

router.get('/join', indexController.getJoin);

router.get('/profile', indexController.getProfile);

module.exports = router;
