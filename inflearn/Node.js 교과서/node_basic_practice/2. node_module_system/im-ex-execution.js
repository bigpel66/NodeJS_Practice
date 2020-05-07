const checkNumber = require('./im-ex-function');
const { even, odd } = require('./im-ex-variable');

function checkStringLength(string) {
    if (string.length % 2) {
        return odd;
    } else {
        return even;
    }
}

console.log(checkNumber(256));
console.log(checkStringLength('Hello'));
