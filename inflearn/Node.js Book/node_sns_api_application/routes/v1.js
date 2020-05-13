const express = require('express');
const v1Controller = require('../controller/v1');
const { verifyToken } = require('../controller/middlewares');

const router = express.Router();

router.post('/token', v1Controller.postToken);

router.get('/test', verifyToken, v1Controller.getTest);

module.exports = router;
