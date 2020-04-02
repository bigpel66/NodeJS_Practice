const fs = require('fs');
const path = require('path');

const rootPath = require('../helpers/path');

const tempPath = path.join(rootPath, 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(tempPath, (error, fileContent) => {
        if (error) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            products.push(this);
            console.log(products);
            fs.writeFile(tempPath, JSON.stringify(products), error => {
                if (error) {
                    console.log(error);
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
};
