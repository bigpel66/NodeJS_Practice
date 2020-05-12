const { Post, User } = require('../models/index');

module.exports.getProfile = (req, res, next) => {
    res.render('profile', { title: 'Profile', user: req.user });
};

module.exports.getJoin = (req, res, next) => {
    res.render('join', {
        title: 'Join',
        user: req.user,
        joinError: req.flash('joinError'),
    });
};

module.exports.getMain = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nickname'],
            },
        });

        res.render('main', {
            title: 'NodeBird',
            twits: posts,
            user: req.user,
            loginError: req.flash('loginError'),
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
