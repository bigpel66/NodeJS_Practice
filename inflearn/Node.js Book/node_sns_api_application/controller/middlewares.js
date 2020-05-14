const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

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

module.exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000,
    max: 10,
    delayMs: 0,
    handler(req, res) {
        return res.status(this.statusCode).json({
            code: this.statusCode,
            message: 'Once Per a Minute',
        });
    },
});

module.exports.deprecated = (req, res, next) => {
    res.status(410).json({
        code: 410,
        message: 'Version Deprecated\nUse New Version',
    });
};
