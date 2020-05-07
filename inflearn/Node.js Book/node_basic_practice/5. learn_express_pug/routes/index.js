var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.render('test', {
        title1: 'Pug',
        title2: 'Template',
        fruits: ['Apple', 'Pear', 'Orange'],
    });
});

module.exports = router;
