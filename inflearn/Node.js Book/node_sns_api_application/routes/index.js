const express = require('express');
const indexController = require('../controller/index');

const router = express.Router();

router.get('/', indexController.getMain);

router.post('/domain', indexController.postDomain);

module.exports = router;
