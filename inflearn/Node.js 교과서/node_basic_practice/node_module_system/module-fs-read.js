const fs = require('fs');

// ASYNC
console.log('시작');
fs.readFile('../files/README.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log('1번');
    console.log(data);
    console.log(data.toString());
});
fs.readFile('../files/README.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log('2번');
    console.log(data);
    console.log(data.toString());
});
fs.readFile('../files/README.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log('3번');
    console.log(data);
    console.log(data.toString());
});
fs.readFile('../files/README.txt', (err, data) => {
    if (err) {
        throw err;
    }
    console.log('4번');
    console.log(data);
    console.log(data.toString());
});
console.log('끝');

// SYNC
console.log('시작');
const data1 = fs.readFileSync('../files/README.txt');
console.log('1번');
console.log(data1);
console.log(data1.toString());
const data2 = fs.readFileSync('../files/README.txt');
console.log('2번');
console.log(data2);
console.log(data2.toString());
const data3 = fs.readFileSync('../files/README.txt');
console.log('3번');
console.log(data3);
console.log(data3.toString());
const data4 = fs.readFileSync('../files/README.txt');
console.log('4번');
console.log(data4);
console.log(data4.toString());
console.log('끝');
