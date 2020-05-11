module.exports.getProfile = (req, res, next) => {
    res.render('profile', { title: 'Profile', user: null });
};

module.exports.getJoin = (req, res, next) => {
    res.render('join', {
        title: 'Join',
        user: null,
        joinError: req.flash('joinError'),
    });
};

module.exports.getMain = (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
        user: null,
        loginError: req.flash('loginError'),
    });
};
