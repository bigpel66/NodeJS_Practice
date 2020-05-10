const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/index');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email', // field name to ref on req.body => req.body.email
                passwordField: 'password', // field name to ref on req.body => req.body.password
            },
            async (email, password, done) => {
                try {
                    const existingUser = await User.find({ where: { email } });

                    if (existingUser) {
                        const result = await bcrypt.compare(
                            password,
                            existingUser.password
                        );

                        if (result) {
                            done(null, existingUser);
                        } else {
                            done(null, false, { message: 'Invalid Password' });
                        }
                    } else {
                        done(null, false, { message: 'No User Found' });
                    }
                } catch (err) {
                    console.error(err);
                    done(err);
                }
            }
        )
    );
};
