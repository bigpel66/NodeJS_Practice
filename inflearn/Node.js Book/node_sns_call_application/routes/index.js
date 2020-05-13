const express = require('express');
const indexController = require('../controller/index');

const router = express.Router();

router.get('/', indexController.getTest);

module.exports = router;
