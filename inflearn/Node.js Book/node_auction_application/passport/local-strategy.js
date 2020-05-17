const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/index');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const existingUser = await User.findOne({
                        where: { email },
                    });

                    if (existingUser) {
                        const result = await bcrypt.compare(
                            password,
                            existingUser.password
                        );

                        if (result) {
                            done(null, existingUser);
                        } else {
                            done(null, false, {
                                message: 'Invalid User Information',
                            });
                        }
                    } else {
                        done(null, false, {
                            message: 'Invalid User Information',
                        });
                    }
                } catch (err) {
                    console.error(err);
                    done(err);
                }
            }
        )
    );
};
