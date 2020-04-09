const Product = require('../models/product');

module.exports.getProducts = (request, response, next) => {
    // SEQUELIZE
    // Product.findAll()
    //     .then((results) => {
    //         response.render('shop/product-list', {
    //             products: results,
    //             pageTitle: 'All Products',
    //             path: '/products',
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    Product.fetchAll()
        .then((products) => {
            response.render('shop/product-list', {
                products: products,
                pageTitle: 'All Products',
                path: '/products',
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.getProduct = (request, response, next) => {
    const productId = request.params.productId;

    // SEQUELIZE
    // // Product.findByPk(productId)
    // //     .then((product) => {
    // // response.render('shop/product-detail', {
    // //     path: '/products',
    // //     pageTitle: product.title,
    // //     product: product,
    // // });
    // //     })
    // //     .catch((error) => {
    // //         if (error) {
    // //             console.log(error);
    // //         }
    // //     });
    // Product.findAll({ where: { id: productId } })
    //     .then((results) => {
    //         response.render('shop/product-detail', {
    //             path: '/products',
    //             pageTitle: results[0].title,
    //             product: results[0],
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    Product.findById(productId)
        .then((product) => {
            response.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.getIndex = (request, response, next) => {
    // SEQUELIZE
    // Product.findAll()
    //     .then((results) => {
    //         response.render('shop/index', {
    //             products: results,
    //             pageTitle: 'Shop',
    //             path: '/',
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    Product.fetchAll()
        .then((products) => {
            response.render('shop/index', {
                products: products,
                pageTitle: 'Shop',
                path: '/',
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.getCart = (request, response, next) => {
    // SEQUELIZE
    // request.user
    //     .getCart()
    //     .then((cart) => {
    //         return cart
    //             .getProducts()
    //             .then((products) => {
    //                 response.render('shop/cart', {
    //                     path: '/cart',
    //                     pageTitle: 'Your Cart',
    //                     products: products,
    //                 });
    //             })
    //             .catch((error) => {
    //                 if (error) {
    //                     console.log(error);
    //                 }
    //             });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    request.user
        .getCart()
        .then((products) => {
            response.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products,
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.postCart = (request, response, nex) => {
    const productId = request.body.productId;

    //SEQUELIZE
    // let fetchedCart;
    // let newQuantity = 1;

    // request.user
    //     .getCart()
    //     .then((cart) => {
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: { id: productId } });
    //     })
    //     .then((products) => {
    //         let product;

    //         if (products.length > 0) {
    //             product = products[0];
    //         }

    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity += oldQuantity;
    //             return product;
    //         }

    //         return Product.findByPk(productId);
    //     })
    //     .then((product) => {
    //         fetchedCart.addProduct(product, {
    //             through: { quantity: newQuantity },
    //         });
    //     })
    //     .then(() => {
    //         response.redirect('/cart');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    Product.findById(productId)
        .then((product) => {
            return request.user.addToCart(product);
        })
        .then((result) => {
            response.redirect('/cart');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.postCartDelete = (request, response, next) => {
    const productId = request.body.productId;

    request.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then((products) => {
            const product = products[0];

            return product.cartItem.destroy();
        })
        .then((result) => {
            response.redirect('/cart');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.getOrders = (request, response, next) => {
    request.user
        .getOrders({ include: ['products'] })
        .then((orders) => {
            response.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.postOrder = (request, response, next) => {
    let fetchedCart;
    let cartProducts;

    request.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            cartProducts = products;
            return request.user.createOrder();
        })
        .then((order) => {
            return order.addProducts(
                cartProducts.map((cartProduct) => {
                    cartProduct.orderItem = {
                        quantity: cartProduct.cartItem.quantity,
                    };
                    return cartProduct;
                })
            );
        })
        .then((result) => {
            return fetchedCart.setProducts(null);
        })
        .then((result) => {
            response.redirect('/orders');
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};
