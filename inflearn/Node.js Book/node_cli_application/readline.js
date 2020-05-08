#!/usr/bin/env node
// READLINE SAMPLE CODE
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.clear();
const answerCallback = (answer) => {
    if (answer.toLowerCase().includes('y')) {
        console.log('Yes it is working');
        rl.close();
    } else if (answer.toLowerCase().includes('n')) {
        console.log('No it is not working');
        rl.close();
    } else {
        console.clear();
        console.log('Type Y or N');
        rl.question('Is it working?', answerCallback);
    }
};
rl.question('Is it working?', answerCallback);
