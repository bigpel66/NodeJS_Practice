const Product = require('../models/product');

module.exports.getAddProduct = (requset, response, next) => {
    response.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add-Product',
        editing: 'false',
    });
};

module.exports.postAddProduct = (request, response, next) => {
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;

    const product = new Product(null, title, imageUrl, description, price);
    product
        .save()
        .then(() => {
            response.redirect('/');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.getEditProduct = (request, response, next) => {
    const editing = request.query.editing;
    const productId = request.params.productId;

    if (editing !== 'true') {
        response.redirect('/products');
    }

    Product.findById(productId, (product) => {
        if (!product) {
            return response.redirect('/');
        }
        response.render('admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Edit Product',
            editing: editing,
            product: product,
        });
    });
};

module.exports.postEditProduct = (request, response, next) => {
    const product = new Product(
        request.body.id,
        request.body.title,
        request.body.imageUrl,
        request.body.description,
        request.body.price
    );

    product.save();

    response.redirect('/admin/products');
};

module.exports.getProducts = (request, response, next) => {
    Product.fetchAll((products) => {
        response.render('admin/products', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
};

module.exports.postDeleteProduct = (request, response, next) => {
    const productId = request.body.productId;
    Product.deleteById(productId);
    response.redirect('/admin/products');
};
