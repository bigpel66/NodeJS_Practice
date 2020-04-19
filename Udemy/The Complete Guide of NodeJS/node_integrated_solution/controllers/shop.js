const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const stripe = require('stripe')('blocked');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

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
    // MONGODB
    // Product.fetchAll()
    //     .then((products) => {
    //         response.render('shop/product-list', {
    //             products: products,
    //             pageTitle: 'All Products',
    //             path: '/products',
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    const page = +request.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then((count) => {
            totalItems = count;

            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then((products) => {
            response.render('shop/product-list', {
                products: products,
                pageTitle: 'All Products',
                path: '/products',
                totalItems: totalItems,
                hasNextPage: page * ITEMS_PER_PAGE < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                currentPage: page,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
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
    // MONGODB
    // Product.fetchAll()
    //     .then((products) => {
    //         response.render('shop/index', {
    //             products: products,
    //             pageTitle: 'Shop',
    //             path: '/',
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    const page = +request.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then((count) => {
            totalItems = count;

            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then((products) => {
            response.render('shop/index', {
                products: products,
                pageTitle: 'Shop',
                path: '/',
                totalItems: totalItems,
                hasNextPage: page * ITEMS_PER_PAGE < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                currentPage: page,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        })
        .catch((err) => {
            if (err) {
                console.log(err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
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
    // MONGODB
    // request.user
    //     .getCart()
    //     .then((products) => {
    //         response.render('shop/cart', {
    //             pageTitle: 'Your Cart',
    //             path: '/cart',
    //             products: products,
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    request.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = [...user.cart.items];

            response.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products,
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

    // MONGODB
    // Product.findById(productId)
    //     .then((product) => {
    //         return request.user.addToCart(product);
    //     })
    //     .then((result) => {
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
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};

module.exports.postCartDelete = (request, response, next) => {
    const productId = request.body.productId;

    // request.user
    //     .getCart()
    //     .then((cart) => {
    //         return cart.getProducts({ where: { id: productId } });
    //     })
    //     .then((products) => {
    //         const product = products[0];

    //         return product.cartItem.destroy();
    //     })
    //     .then((result) => {
    //         response.redirect('/cart');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    // MONGODB
    // request.user
    //     .deleteItemFromCart(productId)
    //     .then((result) => {
    //         response.redirect('/cart');
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    request.user
        .removeFromCart(productId)
        .then((result) => {
            response.redirect('/cart');
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};

module.exports.getCheckout = (request, response, next) => {
    let products;
    let totalSum = 0;

    request.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            products = user.cart.items;
            totalSum = 0;
            products.forEach((productData) => {
                totalSum += productData.quantity * productData.productId.price;
            });

            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map((product) => {
                    return {
                        name: product.productId.title,
                        description: product.productId.description,
                        amount: product.productId.price * 100,
                        currency: 'usd',
                        quantity: product.quantity,
                    };
                }),
                success_url:
                    request.protocol +
                    '://' +
                    request.get('host') +
                    '/checkout/success',
                cancel_url:
                    request.protocol +
                    '://' +
                    request.get('host') +
                    '/checkout/cancel',
            });
        })
        .then((session) => {
            return response.render('shop/checkout', {
                pageTitle: 'Checkout',
                path: '/checkout',
                products: products,
                totalSum: totalSum,
                sessionId: session.id,
            });
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                next(error);
            }
        });
};

module.exports.getOrders = (request, response, next) => {
    // SEQUELIZE
    // request.user
    //     .getOrders({ include: ['products'] })
    //     .then((orders) => {
    //         response.render('shop/orders', {
    //             pageTitle: 'Your Orders',
    //             path: '/orders',
    //             orders: orders,
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });
    // MONGODB
    // request.user
    //     .getOrders()
    //     .then((orders) => {
    //         response.render('shop/orders', {
    //             pageTitle: 'Your Orders',
    //             path: '/orders',
    //             orders: orders,
    //         });
    //     })
    //     .catch((error) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //     });

    Order.find({ 'user.userId': request.user })
        .then((orders) => {
            response.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
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

module.exports.getCheckoutSuccess = (request, response, next) => {
    // SEQUELIZE
    // let fetchedCart;
    // let cartProducts;
    //     request.user
    //         .getCart()
    //         .then((cart) => {
    //             fetchedCart = cart;
    //             return cart.getProducts();
    //         })
    //         .then((products) => {
    //             cartProducts = products;
    //             return request.user.createOrder();
    //         })
    //         .then((order) => {
    //             return order.addProducts(
    //                 cartProducts.map((cartProduct) => {
    //                     cartProduct.orderItem = {
    //                         quantity: cartProduct.cartItem.quantity,
    //                     };
    //                     return cartProduct;
    //                 })
    //             );
    //         })
    //         .then((result) => {
    //             return fetchedCart.setProducts(null);
    //         })
    //         .then((result) => {
    //             response.redirect('/orders');
    //         })
    //         .catch((error) => {
    //             if (error) {
    //                 console.log(error);
    //             }
    //         });
    // MONGODB
    // request.user
    //     .addOrder()
    //     .then((result) => {
    //         response.redirect('/order');
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });

    request.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items.map((item) => {
                return {
                    quantity: item.quantity,
                    product: { ...item.productId._doc },
                };
            });

            const order = new Order({
                user: {
                    email: request.user.email,
                    userId: request.user,
                },
                products: products,
            });

            return order.save();
        })
        .then((result) => {
            return request.user.clearCart();
        })
        .then((result) => {
            response.redirect('/orders');
        })
        .catch((err) => {
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
        });
};

module.exports.getInvoice = (request, response, next) => {
    const orderId = request.params.orderId;

    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new Error('No order found.'));
            }

            if (order.user.userId.toString() !== request.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }

            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            // NONE STREAM
            // fs.readFile(invoicePath, (error, dataContent) => {
            //     if (error) {
            //         next(error);
            //     } else {
            // response.setHeader('Content-Type', 'application/pdf');
            // response.setHeader(
            //     'Content-Disposition',
            //     `inline; filename='${invoiceName}'`
            // );
            //         response.send(dataContent);
            //     }
            // });

            // STREAM WITH GENERATING PDF
            const pdfDoc = new PDFDocument();

            response.setHeader('Content-Type', 'application/pdf');
            response.setHeader(
                'Content-Disposition',
                `inline; filename='${invoiceName}'`
            );

            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(response);

            pdfDoc.fontSize(24).text('Invoice', { underline: true });
            pdfDoc.text('\n');
            let totalPrice = 0;

            order.products.forEach((productData) => {
                totalPrice += productData.product.price * productData.quantity;
                pdfDoc
                    .fontSize(16)
                    .text(
                        productData.product.title +
                            ' - ' +
                            productData.quantity +
                            ' x ' +
                            '$' +
                            productData.product.price
                    );
            });
            pdfDoc
                .fontSize(16)
                .text(
                    '\n\n\n--------------------------------------------------------------------'
                );
            pdfDoc.fontSize(18).text('\nTotal Price: $' + totalPrice);

            pdfDoc.end();

            // STREAM WITH HARD CODING PDF
            // const file = fs.createReadStream(invoicePath);
            // response.setHeader('Content-Type', 'application/pdf');
            // response.setHeader(
            //     'Content-Disposition',
            //     `inline; filename='${invoiceName}'`
            // );
            // file.pipe(response);
        })
        .catch((err) => {
            if (err) {
                next(err);
            }
        });
};
