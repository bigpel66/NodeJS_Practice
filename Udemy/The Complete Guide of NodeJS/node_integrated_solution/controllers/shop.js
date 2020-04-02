const Product = require('../models/product');

module.exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('shop/product-list', {
            products: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

module.exports.getIndex = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('shop/index', {
            products: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

module.exports.getCart = (request, response, next) => {
    response.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

module.exports.getCheckout = (request, response, next) => {
    response.render('shop/checkout', {
        pageTitle: 'Checkout ',
        path: '/checkout'
    });
};
