const fs = require('fs');
const path = require('path');

const rootPath = require('../helpers/path');

const tempPath = path.join(rootPath, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(tempPath, (error, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!error) {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex((product) => {
                return product.id === id;
            });

            if (existingProductIndex >= 0) {
                let existingProduct = cart.products[existingProductIndex];
                existingProduct.quantity = existingProduct.quantity + 1;
                cart.products[existingProductIndex] = existingProduct;
            } else {
                const updatedProduct = { id: id, quantity: 1 };
                cart.products.push(updatedProduct);
            }

            cart.totalPrice += Number(productPrice);

            fs.writeFile(tempPath, JSON.stringify(cart), (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });
    }
};
