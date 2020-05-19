const util = require('util');
const express = require('express');
const indexController = require('../controller/index');

const router = express.Router();

router.get('/', indexController.getMain);

router.get('/autocomplete/:query', indexController.getQueryAutoComplete);

router.get('/search/:query'.indexController.getQuerySearch);

module.exports = router;
