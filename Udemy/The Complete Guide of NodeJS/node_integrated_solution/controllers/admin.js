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

    request.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
        })
        .then((product) => {
            response.redirect('/admin/products');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //     userId: request.user.id,
    // })
    //     .then((product) => {
    //         response.redirect('/admin/products');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });
};

module.exports.getEditProduct = (request, response, next) => {
    const editing = request.query.editing;
    const productId = request.params.productId;

    if (editing !== 'true') {
        response.redirect('/products');
    }

    request.user
        .getProducts({ where: { id: productId } })
        .then((products) => {
            if (!products) {
                return response.redirect('/');
            }

            const product = products[0];

            response.render('admin/edit-product', {
                path: '/admin/edit-product',
                pageTitle: 'Edit Product',
                editing: editing,
                product: product,
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.postEditProduct = (request, response, next) => {
    const productId = request.body.id;
    const productTitle = request.body.title;
    const productPrice = request.body.price;
    const productImageUrl = request.body.imageUrl;
    const productDescription = request.body.description;

    Product.findByPk(productId)
        .then((product) => {
            product.title = productTitle;
            product.price = productPrice;
            product.imageUrl = productImageUrl;
            product.description = productDescription;
            return product.save();
        })
        .then((product) => {
            response.redirect('/admin/products');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.getProducts = (request, response, next) => {
    request.user
        .getProducts()
        .then((products) => {
            response.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.postDeleteProduct = (request, response, next) => {
    const productId = request.body.productId;
    Product.findByPk(productId)
        .then((product) => {
            return product.destroy();
        })
        .then((product) => {
            response.redirect('/admin/products');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};
