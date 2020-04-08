const Product = require('../models/product');

module.exports.getProducts = (request, response, next) => {
    // SEQUELIZE
    // request.user
    //     .getProducts()
    //     .then((products) => {
    //         response.render('admin/products', {
    //             products: products,
    //             pageTitle: 'Admin Products',
    //             path: '/admin/products',
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    Product.fetchAll()
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

    // SEQUELIZE
    // request.user
    //     .createProduct({
    //         title: title,
    //         price: price,
    //         imageUrl: imageUrl,
    //         description: description,
    //     })
    //     .then((product) => {
    //         response.redirect('/admin/products');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });
    // // Product.create({
    // //     title: title,
    // //     price: price,
    // //     imageUrl: imageUrl,
    // //     description: description,
    // //     userId: request.user.id,
    // // })
    // //     .then((product) => {
    // //         response.redirect('/admin/products');
    // //     })
    // //     .catch((error) => {
    // //         if (error) {
    // //             console.log(error);
    // //         }
    // //     });

    const userId = request.user._id;
    const product = new Product(
        title,
        price,
        description,
        imageUrl,
        null,
        userId
    );
    product
        .save()
        .then((results) => {
            response.redirect('/admin/products');
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

    // SEQUELIZE
    // request.user
    //     .getProducts({ where: { id: productId } })
    //     .then((products) => {
    //         if (!products) {
    //             return response.redirect('/');
    //         }

    //         const product = products[0];

    //         response.render('admin/edit-product', {
    //             path: '/admin/edit-product',
    //             pageTitle: 'Edit Product',
    //             editing: editing,
    //             product: product,
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return response.redirect('/');
            }

            response.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
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

    // SEQUELIZE
    // Product.findByPk(productId)
    //     .then((product) => {
    //         product.title = productTitle;
    //         product.price = productPrice;
    //         product.imageUrl = productImageUrl;
    //         product.description = productDescription;
    //         return product.save();
    //     })
    //     .then((product) => {
    //         response.redirect('/admin/products');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    const userId = request.user._id;
    const product = new Product(
        productTitle,
        productPrice,
        productDescription,
        productImageUrl,
        productId,
        userId
    );

    product
        .save()
        .then((result) => {
            response.redirect('/admin/products');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.postDeleteProduct = (request, response, next) => {
    const productId = request.body.productId;

    // SEQUELIZE
    // Product.findByPk(productId)
    //     .then((product) => {
    //         return product.destroy();
    //     })
    //     .then((product) => {
    //         response.redirect('/admin/products');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    Product.deleteById(productId)
        .then((result) => {
            response.redirect('/admin/products');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};
