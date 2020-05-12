const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../models/index');
let globalAccessToken = require('../access-token');

module.exports = (passport) => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: '/auth/kakao/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                if (accessToken) {
                    globalAccessToken.tokenize(accessToken);
                }

                try {
                    const existingUser = await User.findOne({
                        where: { snsId: profile.id, provider: 'kakao' },
                    });

                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        console.log(profile);
                        const newUser = await User.create({
                            email:
                                profile._json &&
                                profile._json.kakao_account.email,
                            nickname:
                                profile._json.kakao_account.profile.nickname,
                            snsId: profile.id,
                            provider: 'kakao',
                        });
                        done(null, newUser);
                    }
                } catch (err) {
                    console.error(err);
                    done(err);
                }
            }
        )
    );
};
