const express = require('express');
const v1Controller = require('../controller/v1');

const router = express.Router();

router.post('/token', v1Controller.postToken);

module.exports = router;
