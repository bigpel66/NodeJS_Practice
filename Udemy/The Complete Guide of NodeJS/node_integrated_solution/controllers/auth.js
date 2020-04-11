module.exports.getLogin = (request, response, next) => {
    const isLoggedIn =
        request.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';
    response.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isLoggedIn: isLoggedIn,
    });
};

module.exports.postLogin = (request, response, next) => {
    // response.setHeader('Set-Cookie', 'loggedIn=true');
    request.session.isLoggedIn = true;
    response.redirect('/');
};
