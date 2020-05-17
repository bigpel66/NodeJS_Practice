const { Good, User, Auction } = require('../models/index');

module.exports.getUser = (req, res, next) => {
    res.locals.user = req.user;
    next();
};

module.exports.getMain = async (req, res, next) => {
    try {
        const goods = await Good.findAll({ where: { bidderId: null } });

        res.render('main', {
            title: 'Node Auction',
            goods,
            loginError: req.flash('loginError'),
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getJoin = (req, res, next) => {
    res.render('join', {
        title: 'Join - Node Auction',
        joinError: req.flash('joinError'),
    });
};

module.exports.getGood = (req, res, next) => {
    res.render('good', {
        title: 'Register Good - Node Auction',
    });
};

module.exports.postGood = async (req, res, next) => {
    try {
        const { name, price } = req.body;
        await Good.create({
            name,
            price,
            imageUrl: req.file.filename,
            ownerId: req.user.id, 
        });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};
