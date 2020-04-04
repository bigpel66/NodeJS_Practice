const fs = require('fs');
const path = require('path');

const rootPath = require('../helpers/path');

const tempPath = path.join(rootPath, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(tempPath, (error, fileContent) => {
        if (error) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex((product) => {
                    return product.id === this.id;
                });
                products[existingProductIndex] = this;
            } else {
                this.id = Math.random().toString();
                products.push(this);
            }
            console.log(products);
            fs.writeFile(tempPath, JSON.stringify(products), (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(productId, cb) {
        getProductsFromFile((products) => {
            const product = products.find((product) => {
                return product.id === productId;
            });
            cb(product);
        });
    }
};
