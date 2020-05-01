// VAR LET CONST
// ---------------------------------------------------------------------------
// BEFORE ES6
// if (true) {
//     var input = 345;
// }
// console.log(input);

// AFTER ES6
// if (true) {
//     let input = 345;
// }
// console.log(input);

// TESTING CONST WITH NON OBJECT
// const a = 3;
// a = 4;
// console.log(a);

// TESTING CONST WITH OBJECT
// const a = [3, 4, 5];
// a[1] = 6;
// console.log(a);
// ---------------------------------------------------------------------------

// TEMPLATE STRINGS: WITH BACKTICK, WITHOUT BACKTICK
// ---------------------------------------------------------------------------
// BEFORE ES6
// var a = 3;
// var b = 4;
// var c = 'Hello ' + a + ' ' + b;
// console.log(c);

// AFTER ES6
// const a = 3;
// const b = 4;
// const c = `Hello ${a} ${b}`;
// console.log(c);
// ---------------------------------------------------------------------------

// OBJECT LITERAL
// ---------------------------------------------------------------------------
// BEFORE ES6
// var sayNode = function () {
//     console.log('Node');
// };
// var es = 'ES';
// var object = {
//     sayJS: function () {
//         console.log('JS');
//     },
//     sayNode: sayNode,
// };
// object[es + 6] = 'Fantastic';
// object.sayJS();
// object.sayNode();
// console.log(object.ES6);

// AFTER ES6
// const sayNode = function () {
//     console.log('Node');
// };
// const es = 'ES';
// const object = {
//     sayJS() {
//         console.log('JS');
//     },
//     sayNode,
//     [es + 6]: 'Fantastic',
// };
// object.sayJS();
// object.sayNode();
// console.log(object.ES6);
// ---------------------------------------------------------------------------

// ARROW Function
// ---------------------------------------------------------------------------
// BEFORE ES6

// AFTER ES6
// ---------------------------------------------------------------------------
