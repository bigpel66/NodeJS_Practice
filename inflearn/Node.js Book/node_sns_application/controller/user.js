const { User } = require('../models/index');

module.exports.postFollow = async (req, res, next) => {
    try {
        const currentUser = await User.findOne({ where: { id: req.user.id } });

        await currentUser.addFollowing(parseInt(req.params.id, 10));

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.postUnFollow = async (req, res, next) => {
    try {
        const currentUser = await User.findOne({ where: { id: req.user.id } });

        await currentUser.removeFollowing(parseInt(req.params.id, 10));

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};
