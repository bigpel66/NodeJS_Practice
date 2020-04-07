const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports.getProducts = (request, response, next) => {
    Product.findAll()
        .then((results) => {
            response.render('shop/product-list', {
                products: results,
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
    // Product.findByPk(productId)
    //     .then((product) => {
    // response.render('shop/product-detail', {
    //     path: '/products',
    //     pageTitle: product.title,
    //     product: product,
    // });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });
    Product.findAll({ where: { id: productId } })
        .then((results) => {
            response.render('shop/product-detail', {
                path: '/products',
                pageTitle: results[0].title,
                product: results[0],
            });
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            }
        });
};

module.exports.getIndex = (request, response, next) => {
    Product.findAll()
        .then((results) => {
            response.render('shop/index', {
                products: results,
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
    request.user
        .getCart()
        .then((cart) => {
            return cart
                .getProducts()
                .then((products) => {
                    response.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products,
                    });
                })
                .catch((error) => {
                    if (error) {
                        console.log(error);
                    }
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
    let fetchedCart;
    let newQuantity = 1;

    request.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then((products) => {
            let product;

            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity += oldQuantity;
                return product;
            }

            return Product.findByPk(productId);
        })
        .then((product) => {
            fetchedCart.addProduct(product, {
                through: { quantity: newQuantity },
            });
        })
        .then(() => {
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
