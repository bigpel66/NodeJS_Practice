const jwt = require('jsonwebtoken');

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('Not Authorized');
    }
};

module.exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

module.exports.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );

        return next();
    } catch (err) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: 'Token Expired',
            });
        }
        return res.status(401).json({
            code: 401,
            message: 'Invalid Token',
        });
    }
};
