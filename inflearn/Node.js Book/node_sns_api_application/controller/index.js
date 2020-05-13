const { uuid } = require('uuidv4');
const { User, Domain } = require('../models/index');

module.exports.getMain = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({
            where: { id: (req.user && req.user.id) || null },
            include: [{ model: Domain }],
        });

        res.render('login', {
            user: existingUser,
            loginError: req.flash('loginError'),
            domains: existingUser && existingUser.domains,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.postDomain = async (req, res, next) => {
    try {
        await Domain.create({
            userId: req.user.id,
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuid(),
        });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};
