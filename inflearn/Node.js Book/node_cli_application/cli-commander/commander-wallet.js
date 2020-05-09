#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { version } = require('./package.json');
const { sequelize, Wallet } = require('./models/index');

const dbCreateOperation = async (money, description, type) => {
    await sequelize.sync();
    await Wallet.create({
        money: parseInt(money, 10),
        description,
        type: type,
    });
    await sequelize.close();
};

const dbReadOperation = async () => {
    await sequelize.sync();
    const logs = await Wallet.findAll({});
    const revenue = logs
        .filter((log) => {
            return log.type === true;
        })
        .reduce((acc, cur) => {
            return acc + cur.money;
        }, 0);
    const expense = logs
        .filter((log) => {
            return log.type === false;
        })
        .reduce((acc, cur) => {
            return acc + cur.money;
        }, 0);
    await sequelize.close();

    return revenue - expense;
};

program.version(version, '-v, --version').usage('[options]');

program
    .command('revenue <money> <description>')
    .usage('<money> <description>')
    .description('Record Revenue')
    .action(async (money, description) => {
        await dbCreateOperation(money, description, 1);
        console.log(chalk.green(`${money} Revenue Recorded`));
    });

program
    .command('expense <money> <description>')
    .usage('<money> <description>')
    .description('Record Expense')
    .action(async (money, description) => {
        await dbCreateOperation(money, description, 0);
        console.log(chalk.green(`${money} Expense Recorded`));
    });

program
    .command('balance')
    .description('Show Balance')
    .action(async () => {
        const diff = await dbReadOperation();
        console.log(`Balance => ${diff}`);
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
                message: 'Command?',
                choices: ['revenue', 'expense', 'balance'],
            },
            {
                type: 'input',
                name: 'money',
                message: 'Amount?',
                default: 0,
                when: (answers) => {
                    return ['revenue', 'expense'].includes(answers.type);
                },
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description?',
                default: '.',
                when: (answers) => {
                    return ['revenue', 'expense'].includes(answers.type);
                },
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Confirm?',
            },
        ]);

        if (answers.confirm) {
            if (answers.type === 'revenue') {
                await dbCreateOperation(answers.money, answers.description, 1);
            } else if (answers.type === 'expense') {
                await dbCreateOperation(answers.money, answers.description, 0);
            } else {
                const diff = await dbReadOperation();
                console.log(`Balance => ${diff}`);
            }
        }
    }
});

program.parse(process.argv);
