const Product = require('../models/product');

module.exports.getProducts = (request, response, next) => {
    Product.fetchAll((products) => {
        response.render('shop/product-list', {
            products: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    });
};

module.exports.getProduct = (request, response, next) => {
    const productId = request.params.productId;
    Product.findById(productId, (product) => {
        response.render('shop/product-detail', {
            path: '/products',
            pageTitle: product.title,
            product: product,
        });
    });
};

module.exports.getIndex = (request, response, next) => {
    Product.fetchAll((products) => {
        response.render('shop/index', {
            products: products,
            pageTitle: 'Shop',
            path: '/',
        });
    });
};

module.exports.getCart = (request, response, next) => {
    response.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
    });
};

module.exports.postCart = (request, response, nex) => {
    const productId = request.body.productId;

    console.log(productId);
    response.redirect('/cart');
};

module.exports.getOrders = (request, response, next) => {
    response.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
    });
};

module.exports.getCheckout = (request, response, next) => {
    response.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};
