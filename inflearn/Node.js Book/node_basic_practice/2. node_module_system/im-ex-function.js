const { even, odd } = require('./im-ex-variable');

// console.log(even);
// console.log(odd);

function checkEvenOrOdd(number) {
    if (number % 2) {
        return odd;
    } else {
        return even;
    }
}

module.exports = checkEvenOrOdd;
