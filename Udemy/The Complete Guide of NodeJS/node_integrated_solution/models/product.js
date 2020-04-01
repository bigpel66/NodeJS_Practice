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
    constructor(title) {
        this.title = title;
    }

    save() {
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
