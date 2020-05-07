const express = require('express');
const router = express.Router();

router
    .get('/:id', (req, res, next) => {
        res.render();
    })
    .patch('/:id', () => {})
    .delete('/:id', () => {});

router.post('/', () => {});

module.exports = router;
