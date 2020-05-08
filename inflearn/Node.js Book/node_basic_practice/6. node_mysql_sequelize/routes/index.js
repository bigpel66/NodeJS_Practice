const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('sequelize', { title: 'Express' });
});

module.exports = router;
