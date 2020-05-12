const local = require('./local-strategy');
const kakao = require('./kakao-strategy');
const { User } = require('../models/index');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const existingUser = await User.findOne({ where: { id } });
            done(null, existingUser);
        } catch (err) {
            done(err);
        }
    });

    local(passport);
    kakao(passport);
};
