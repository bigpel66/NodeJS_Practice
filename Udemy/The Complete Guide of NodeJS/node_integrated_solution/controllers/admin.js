const Product = require('../models/product');
const fileHelper = require('../helpers/file');

const { validationResult } = require('express-validator/check');

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
    // MONGODB
    // Product.fetchAll()
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

    Product.find({ userId: request.user._id })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then((products) => {
            response.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};

module.exports.getAddProduct = (request, response, next) => {
    response.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add-Product',
        editing: 'false',
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    });
};

module.exports.postAddProduct = (request, response, next) => {
    const title = request.body.title;
    // const imageUrl = request.body.imageUrl;
    const image = request.file;
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

    // MONGODB
    // const userId = request.user._id;
    // const product = new Product(
    //     title,
    //     price,
    //     description,
    //     imageUrl,
    //     null,
    //     userId
    // );
    // product
    //     .save()
    //     .then((results) => {
    //         response.redirect('/admin/products');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    if (!image) {
        return response.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: 'false',
            hasError: true,
            product: {
                title: title,
                description: description,
                price: price,
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: [],
        });
    }

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: 'false',
            hasError: true,
            product: {
                tile: title,
                description: description,
                price: price,
            },
            errorMessage: errors.array()[0].msg,
            validatonErrors: errors.array(),
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: request.user,
    });

    product
        .save()
        .then((result) => {
            response.redirect('/admin/products');
        })
        .catch((err) => {
            if (err) {
                // Redundant Code on Error
                // return response.status(500).render('admin/edit-product', {
                //     pageTitle: 'Add Product',
                //     path: '/admin/add-product',
                //     editing: 'false',
                //     hasError: true,
                //     product: {
                //         tile: title,
                //         imageUrl: imageUrl,
                //         description: description,
                //         price: price,
                //     },
                //     errorMessage:
                //         'Database Operation Failed, Please Try Again!',
                //     validatonErrors: [],
                // });
                // Also Redundant Codes on Error
                // return response.redirect('/500');
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
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
                hasError: false,
                errorMessage: null,
                validationErrors: [],
            });
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};

module.exports.postEditProduct = (request, response, next) => {
    const productId = request.body.id;
    const productTitle = request.body.title;
    const productPrice = request.body.price;
    // const productImageUrl = request.body.imageUrl;
    const image = request.file;
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

    // MONGODB
    // const userId = request.user._id;
    // const product = new Product(
    //     productTitle,
    //     productPrice,
    //     productDescription,
    //     productImageUrl,
    //     productId,
    //     userId
    // );

    // product
    //     .save()
    //     .then((result) => {
    //         response.redirect('/admin/products');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Produdct',
            path: '/admin/edit-product',
            editing: 'true',
            product: {
                _id: productId,
                title: productTitle,
                price: productPrice,
                description: productDescription,
            },
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        });
    }

    Product.findById(productId)
        .then((product) => {
            if (product.userId.toString() !== request.user._id.toString()) {
                return response.redirect('/');
            }
            product.title = productTitle;
            product.price = productPrice;
            product.description = productDescription;
            // product.imageUrl = productImageUrl;

            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }

            return product.save().then((result) => {
                response.redirect('/admin/products');
            });
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
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

    // MONGODB
    // Product.deleteById(productId)
    //     .then((result) => {
    //         response.redirect('/admin/products');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    // NOT AUTORIZED BY EACH USER
    // Product.findByIdAndRemove(productId)
    //     .then((result) => {
    //         response.redirect('/admin/products');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return next(new Error('Product not found.'));
            }
            fileHelper.deleteFile(product.imageUrl);

            return Product.deleteOne({
                _id: productId,
                userId: request.user._id,
            });
        })
        .then((result) => {
            response.redirect('/admin/products');
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        })
        .catch((err) => {
            if (err) {
                return next(err);
            }
        });
};
