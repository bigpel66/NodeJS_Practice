module.exports.get404 = (request, response, next) => {
    response.status(404).render('404', {
        path: '/404',
        pageTitle: 'Page Not Found',
        isLoggedIn: request.isLoggedIn,
    });
};
