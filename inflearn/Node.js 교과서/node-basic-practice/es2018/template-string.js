// TEMPLATE STRINGS: WITH BACKTICK, WITHOUT BACKTICK

// BEFORE ES6
var a = 3;
var b = 4;
var c = 'Hello ' + a + ' ' + b;
console.log(c);

// AFTER ES6
const d = 3;
const e = 4;
const f = `Hello ${d} ${e}`;
console.log(f);
