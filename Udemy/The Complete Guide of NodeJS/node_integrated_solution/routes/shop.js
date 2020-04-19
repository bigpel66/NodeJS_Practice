const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router
    .get('/cart', isAuth, shopController.getCart)
    .post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDelete);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

// DOESN'T NEED ANYMORE
// CHECKOUT SUCCESS, REDIRECT AND POST ORDER
// router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
