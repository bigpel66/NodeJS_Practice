module.exports.getLogin = (request, response, next) => {
    response.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
    });
};
