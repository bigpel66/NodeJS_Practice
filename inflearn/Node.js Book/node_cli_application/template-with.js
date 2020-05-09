#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

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

const makeTemplate = (type, name, directory) => {
    mkdir(directory);
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)) {
            console.error(chalk.bold.red('Already Exists'));
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(chalk.green(pathToFile, 'Generated'));
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if (exist(pathToFile)) {
            console.error(chalk.bold.red('Already Exists'));
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(chalk.green(pathToFile, 'Generated'));
        }
    } else {
        console.error(
            chalk.bold.red('Example: cli html|express-router $fileName [$path]')
        );
    }
};

const copyFile = (source, destination) => {
    if (exist(source)) {
        mkdir(destination);
        fs.copyFileSync(
            source,
            path.join(
                destination,
                `${source.split('.')[0]}-copied${path.extname(source)}`
            )
        );
        console.log(chalk.green(`${source}File Copied`));
    } else {
        console.log(chalk.red('No File Found'));
    }
};

const rimraf = (dir) => {
    if (exist(dir)) {
        try {
            const readDir = fs.readdirSync(dir);
            readDir.forEach((val) => {
                rimraf(path.join(dir, val));
            });
            fs.rmdirSync(dir);
            console.log(chalk.green('Directory has been deleted'));
        } catch (err) {
            fs.unlinkSync(dir);
            console.log(chalk.green('File has been deleted'));
        }
    } else {
        console.log(chalk.red('No Directory Found'));
    }
};

program.version('0.0.1', '-v, --version').name('cli').usage('[options]');

program
    .command('template <type>')
    .usage('--filename <filename> --filepath [filepath]')
    .description('Template Generation')
    .alias('tmpl')
    .option('-fn, --filename <filename>', 'Type File Name', 'index')
    .option('-fp, --filepath [filepath]', 'Type File Path', '.')
    .action((type, options) => {
        // console.log(type, options.filename, options.filepath);
        makeTemplate(type, options.filename, options.filepath);
    });

program
    .command('copy <source> <destination>')
    .usage('<source> <destination>')
    .description('Copy File')
    .action((source, destination) => {
        copyFile(source, destination);
    });

program
    .command('rimraf <dir>')
    .usage('<dir>')
    .description('Designated Directory Totally Deleted')
    .action((dir) => {
        rimraf(dir);
    });

program.action(async (cmd, args) => {
    if (args) {
        console.error(chalk.bold.red('No Command Found'));
        program.help();
    } else {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Choose Template',
                choices: ['html', 'express-router'],
            },
            {
                type: 'input',
                name: 'name',
                message: 'Type File Name',
                default: 'index',
            },
            {
                type: 'input',
                name: 'directory',
                message: 'Type File Path',
                default: '.',
            },
            { type: 'confirm', name: 'confirm', message: 'Confirm?' },
        ]);

        if (answers.confirm) {
            makeTemplate(answers.type, answers.name, answers.directory);
            console.log(chalk.rgb(128, 128, 128)('CLI Terminated'));
        }
    }
});

program.parse(process.argv);
