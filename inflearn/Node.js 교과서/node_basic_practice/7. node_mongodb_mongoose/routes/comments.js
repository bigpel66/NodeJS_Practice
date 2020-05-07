const express = require('express');
const router = express.Router();

router
    .get('/:id', (req, res, next) => {})
    .patch('/:id', (req, res, next) => {})
    .delete('/:id', (req, res, next) => {});

router.post('/', (req, res, next) => {});

module.exports = router;
