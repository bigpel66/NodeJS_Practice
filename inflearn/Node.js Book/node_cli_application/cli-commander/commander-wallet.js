#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { version } = require('./package.json');

program.version(version, '-v, --version').usage('[options]');

program
    .command('revenue <money> <description>')
    .usage('<money> <description>')
    .description('Record Revenue')
    .action(() => {});

program
    .command('expense <money> <description>')
    .usage('<money> <description>')
    .description('Record Expense')
    .action(() => {});

program
    .command('balance')
    .description('Show Balance')
    .action(() => {});

program.command('*').action(() => {
    console.log('No Command Found');
});

program.parse(process.argv);
