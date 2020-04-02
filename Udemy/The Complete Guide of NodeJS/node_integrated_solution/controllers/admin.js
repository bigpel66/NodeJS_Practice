const Product = require('../models/product');

module.exports.getAddProduct = (requset, response, next) => {
    response.render('admin/add-product', {
        path: '/admin/add-product',
        pageTitle: 'Add-Product',
        activeAddProduct: true,
        productCSS: true,
        formsCSS: true
    });
};

module.exports.postAddProduct = (request, response, next) => {
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;

    const product = new Product(title, imageUrl, price, description);
    product.save();
    response.redirect('/admin/products');
};

module.exports.getProducts = (request, response, next) => {
    Product.fetchAll(products => {
        response.render('admin/products', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};
