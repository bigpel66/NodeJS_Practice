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

module.exports.getMain = (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
        user: req.user,
        loginError: req.flash('loginError'),
    });
};
