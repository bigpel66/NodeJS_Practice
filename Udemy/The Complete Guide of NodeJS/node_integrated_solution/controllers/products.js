const Product = require('../models/product');

module.exports.getAddProduct = (requset, response, next) => {
    response.render('add-product', {
        path: '/admin/add-product',
        pageTitle: 'Add-Product',
        activeAddProduct: true,
        productCSS: true,
        formsCSS: true
    });
};

module.exports.postAddProduct = (request, response, next) => {
    const product = new Product(request.body.title);
    product.save();
    response.redirect('/');
};

module.exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('shop', {
            products: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};
