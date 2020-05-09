#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { version } = require('./package.json');
const { sequelize, Wallet } = require('./models/index');

program.version(version, '-v, --version').usage('[options]');

program
    .command('revenue <money> <description>')
    .usage('<money> <description>')
    .description('Record Revenue')
    .action(async (money, description) => {
        await sequelize.sync();
        await Wallet.create({
            money: parseInt(money, 10),
            description,
            type: 1,
        });
        console.log(chalk.green(`${money} Revenue Recorded`));
        await sequelize.close();
    });

program
    .command('expense <money> <description>')
    .usage('<money> <description>')
    .description('Record Expense')
    .action(async (money, description) => {
        await sequelize.sync();
        await Wallet.creat({
            money: parseInt(money, 10),
            description,
            type: 0,
        });
        console.log(chalk.green(`${money} Expense Recorded`));
        await sequelize.close();
    });

program
    .command('balance')
    .description('Show Balance')
    .action(async () => {
        await sequelize.sync();
        const logs = await Wallet.findAll({});
        const revenue = logs
            .filter((log) => {
                return log.type === 1;
            })
            .reduce((acc, cur) => {
                return acc + cur.money;
            }, 0);
        const expense = logs
            .filter((log) => {
                return log.type === 0;
            })
            .reduce((acc, cur) => {
                return acc + cur.money;
            }, 0);
        console.log(`Balance => ${revenue - expense}`);
        await sequelize.close();
    });

program.command('*').action(() => {
    console.log('No Command Found');
});

program.parse(process.argv);
