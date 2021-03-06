const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models/index');

module.exports.postJoin = async (req, res, next) => {
    const { email, password, nickname, money } = req.body;

    if (money > 999999999) {
        req.flash('joinError', 'Too Much Money');
        return res.redirect('/join');
    }
    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            req.flash('joinError', 'User Already Exists');
            return res.redirect('/join');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            email,
            nickname,
            password: hashedPassword,
            money,
        });

        return res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }

        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

module.exports.getLogout = (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};
