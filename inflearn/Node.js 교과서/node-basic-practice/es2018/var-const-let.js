// VAR LET CONST

// BEFORE ES6
if (true) {
    var input1 = 345; // Does work
}
console.log(input1);

// AFTER ES6
if (true) {
    let input2 = 345; // Does not work
}
console.log(input2);

// TESTING CONST WITH NON OBJECT
const a = 3;
a = 4;
console.log(a); // Does not work

// TESTING CONST WITH OBJECT
const b = [3, 4, 5];
b[1] = 6;
console.log(b); // Does work
