const local = require('./local-strategy');
const kakao = require('./kakao-strategy');
const { User } = require('../models/index');
let userInfo = require('../user-info');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log(userInfo);
        if (userInfo[id]) {
            done(null, userInfo[id]);
        } else {
            try {
                const existingUser = await User.findOne({ where: { id } });
                userInfo[id] = existingUser;
                done(null, existingUser);
            } catch (err) {
                done(err);
            }
        }
    });

    local(passport);
    kakao(passport);
};
