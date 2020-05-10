module.exports.getMain = (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
        user: null,
        loginError: req.flash('Login Error'),
    });
};

module.exports.getJoin = (req, res, next) => {
    res.render('join', {
        title: 'Join',
        user: null,
        joinError: req.flash('Join Error'),
    });
};

module.exports.getProfile = (req, res, next) => {
    res.render('profile', { title: 'Profile', user: null });
};
