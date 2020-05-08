#!/usr/bin/env node
// TEMPLATE GENERATOR WITHOUT THIRD PARTY PACKAGE
const fs = require('fs');
const path = require('path');
const readline = require('readline');

let rl;
let type = process.argv[2]; // Which Template to Generate
let name = process.argv[3]; // File Name for Template
let directory = process.argv[4] || '.'; // Path for Template

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
    const express = require('express');
    const router = express.Router();

    router.get('/', (req, res, next) => {
        try {
            res.send('ok')
        } catch(err) {
            console.error(err)
            next(err);
        }
    })
    module.exports = router;
`;

const exist = (dir) => {
    try {
        fs.accessSync(
            dir,
            fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
        );
        return true;
    } catch (err) {
        return false;
    }
};

const mkdir = (dir) => {
    const dirname = path
        .relative('.', path.normalize(dir))
        .split(path.sep)
        .filter((p) => {
            return !!p; // to filter undefined
        });

    dirname.forEach((val, index) => {
        const pathBuilder = dirname.slice(0, index + 1).join(path.sep);
        if (!exist(pathBuilder)) {
            fs.mkdirSync(pathBuilder);
        }
    });
};

const makeTemplate = () => {
    mkdir(directory);
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)) {
            console.error('Already Exists');
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, 'Generated');
        }
    } else if (type === 'express-router') {
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

const dirAnswer = (answer) => {
    directory = (answer && answer.trim()) || '.';
    rl.close();
    makeTemplate();
};

const nameAnswer = (answer) => {
    if (!answer || !answer.trim()) {
        console.clear();
        console.log('File Name Should Not Be Null');
        return rl.question('Type file name you want to use', nameAnswer);
    }

    name = answer;

    return rl.question(
        'Set the path where to save (Default for the current)',
        dirAnswer
    );
};
const typeAnswer = (answer) => {
    if (answer !== 'html' && answer !== 'express-router') {
        console.clear();
        console.log(`Only Acccepted 'html' or 'express-router'`);
        return rl.question('Choose template you want to use', typeAnswer);
    }

    type = answer;

    return rl.question('Type file name you want to use', nameAnswer);
};

const program = () => {
    if (!type || !name) {
        // console.error('Example: cli html|express-router $fileName [$path]');
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        console.clear();
        rl.question('Choose template you want to use', typeAnswer);
    } else {
        makeTemplate();
    }
};

program();
