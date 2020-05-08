#!/usr/bin/env node
// TEMPLATE GENERATOR
const fs = require('fs');
const path = require('path');

const type = process.argv[2]; // Which Template to Generate
const name = process.argv[3]; // File Name for Template
const directory = process.argv[4] || '.'; // Path for Template

const htmlTemplate = `
    <html>
        <head>
            <meta chart="utf-8"/>
            <title>Template</title>
        </head>
        <body>
            <h1>Hello</h1>
            <p>CLI</p>
        </body>
    </html>
`;

const routerTemplate = `
    const express = require('express);
    const router = express.Router();

    router.get('/', (req, res, next) => {
        try {
            res.sned('ok)
        } catch(err) {
            console.error(err)
            next(err);
        }
    })
    module.exports = router;
`;

const exist = () => {};

const mkdir = () => {};

const makeTemplate = () => {
    mkdir(directory); // TODO: implement
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)) {
            // TODO: implement
            console.error('Already Exists');
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, 'Generated');
        }
    } else if (type === 'express-router') {
        // TODO: implement
        const pathToFile = path.join(directory, `${name}.js`);
        if (exist(pathToFile)) {
            console.error('Already Exists');
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, 'Generated');
        }
    } else {
        console.error('Example: cli html|express-router $fileName [$path]');
    }
};

const program = () => {
    if (!type || !name) {
        console.error('Example: cli html|express-router $fileName [$path]');
    } else {
        makeTemplate();
    }
};

program();
