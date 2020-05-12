const bcrypt = require('bcrypt');
const passport = require('passport');
const rp = require('request-promise');
const { User } = require('../models/index');
let globalAccessToken = require('../access-token');

module.exports.postJoin = async (req, res, next) => {
    const { email, password, nickname } = req.body;

    console.log(email, password, nickname);
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

module.exports.getLogout = async (req, res, next) => {
    if (req.user.provider === 'kakao') {
        try {
            await rp({
                url: 'https://kapi.kakao.com/v1/user/unlink',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${globalAccessToken.readToken()}`,
                },
            });
        } catch (err) {
            console.error(err);
            globalAccessToken.tokenize(null);
        }
    }
    req.logout();
    req.session.destroy();
    res.redirect('/');
};

module.exports.getKakao = (req, res, next) => {
    passport.authenticate('kakao')(req, res, next);
};

module.exports.getKakaoCallback = (req, res, next) => {
    passport.authenticate('kakao', {
        failureRedirect: '/',
        successRedirect: '/',
    })(req, res, next);
};
