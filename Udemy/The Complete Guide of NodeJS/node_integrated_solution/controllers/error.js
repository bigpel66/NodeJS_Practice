module.exports.get404 = (request, response, next) => {
    response.status(404).render('404', {
        path: '/404',
        pageTitle: 'Page Not Found',
    });
};

module.exports.get500 = (request, response, next) => {
    response.status(500).render('500', {
        path: '/500',
        pageTitle: 'Error!',
    });
};
