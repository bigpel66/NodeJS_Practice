const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const authHeader = request.get('Authorization');

    if (!authHeader) {
        request.isAuth = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'somesupersecretkeyvalue');
    } catch (err) {
        request.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        request.isAuth = false;
        return next();
    }

    request.userId = decodedToken.userId;
    request.isAuth = true;
    
    next();
};
