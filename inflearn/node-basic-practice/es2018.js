// VAR LET CONST
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// BEFORE ES6
// if (true) {
//     var input = 345;
// }
// console.log(input);
// -----------------------------------------------------------------------------------------------------------------
// AFTER ES6
// if (true) {
//     let input = 345;
// }
// console.log(input);
// -----------------------------------------------------------------------------------------------------------------
// TESTING CONST WITH NON OBJECT
// const a = 3;
// a = 4;
// console.log(a);
// -----------------------------------------------------------------------------------------------------------------
// TESTING CONST WITH OBJECT
// const a = [3, 4, 5];
// a[1] = 6;
// console.log(a);
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// TEMPLATE STRINGS: WITH BACKTICK, WITHOUT BACKTICK
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// BEFORE ES6
// var a = 3;
// var b = 4;
// var c = 'Hello ' + a + ' ' + b;
// console.log(c);
// -----------------------------------------------------------------------------------------------------------------
// AFTER ES6
// const a = 3;
// const b = 4;
// const c = `Hello ${a} ${b}`;
// console.log(c);
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// OBJECT LITERAL
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ARROW Function
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// BEFORE ES6
// var add = function (x, y) {
//     return x + y;
// };
// var result = add(2, 3);
// console.log(result);
// -----------------------------------------------------------------------------------------------------------------
// AFTER ES6
// let add = (x, y) => {
//     return x + y;
// };
// let result = add(2, 3);
// console.log(result);
// -----------------------------------------------------------------------------------------------------------------
// THIS ON FUNCTION () {}
// var relationship = {
// name: 'J',
// friends: ['S', 'K', 'L'],
//     logFriends: function () {
// var that = this;
//         this.friends.forEach(function (friend) {
// console.log(that.name, friend); // function 내부의 this와 외부의 this가 서로 다르기 때문에 that에 넣어서 사용한다.
//         });
//     },
// };
// relationship.logFriends();
// -----------------------------------------------------------------------------------------------------------------
// THIS ON ARROW FUNCTION
// const relationship = {
//     name: 'J',
//     friends: ['S', 'K', 'L'],
//     logFriends() {
//         this.friends.forEach((friend) => {
//             console.log(this.name, friend); // Arrow Function 덕에 내부의 this와 외부의 this가 서로 동일하게 취급된다.
//         });
//     },
// };
// relationship.logFriends();
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// DESTRUCTURING
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// BEFORE ES6
// var candyMachine = {
//     status: {
//         name: 'node',
//         count: 5,
//     },
//     getCandy: function () {
//         this.status.count--;
//         console.log(this.status.count);
//         return this.status.count;
//     },
// };
// var status = candyMachine.status;
// var getCandy = candyMachine.getCandy;
// console.log(status);
// getCandy(); // Does not work
// getCandy.bind(candyMachine)();
// getCandy.call(candyMachine);
// -----------------------------------------------------------------------------------------------------------------
// AFTER ES6
// const candyMachine = {
//     status: {
//         name: 'node',
//         count: 5,
//     },
//     getCandy() {
//         this.status.count--;
//         console.log(this.status.count);
//         return this.status.count;
//     },
// };
// const { status, getCandy } = candyMachine;
// console.log(status);
// getCandy(); // Does not work
// getCandy.bind(candyMachine)();
// getCandy.call(candyMachine);
// -----------------------------------------------------------------------------------------------------------------
// ARRAY DESTRUCTURING
// const array = ['node', {}, 10, true];
// const [node, obj, , bool] = array;
// console.log(node);
// console.log(obj);
// console.log(bool);
// -----------------------------------------------------------------------------------------------------------------
// ARGUMENTS KEYWORD
// var args = [1, 2, 3, 4, 5];
// function o() {
//     console.log(arguments);
// }
// o(args);
// -----------------------------------------------------------------------------------------------------------------
// SPREAD OPERATOR EXAMPLE 1
// const array = ['node', {}, 10, true];
// const [node, obj, ...rest] = array;
// console.log(node);
// console.log(obj);
// console.log(rest);
// -----------------------------------------------------------------------------------------------------------------
// SPREAD OPERATOR EXAMPLE 2
// const m = (x, y) => console.log(x, y);
// m(5, 6);
// const n = (x, ...y) => console.log(x, y);
// n(5, 6, 7, 8, 9);
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// PROMISE
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// PROMISE CHAINING
// const promise = new Promise((resolve, reject) => {
//     const a = 1;
//     const b = 3;
//     if (a + b > 2) {
//         resolve(a + b);
//     } else {
//         reject(a + b);
//     }
// });
// promise
//     .then((res) => {
//         console.log('First Result: ', res);
//         return new Promise((resolve, reject) => {
//             const a = 2;
//             const b = 2;
//             if (a * b == 2) {
//                 resolve(a * b);
//             } else {
//                 reject(a * b);
//             }
//         });
//     })
//     .then((res) => {
//         console.log('Second Result: ', res);
//     })
//     .catch((err) => {
//         if (err) {
//             console.log('An Error: ', err);
//         }
//     });
// -----------------------------------------------------------------------------------------------------------------
// SHORTER PROMISE RESOLVE AND REJECT
// const successPromise = Promise.resolve('success');
// const failurePromise = Promise.reject('failure');
// successPromise
//     .then((res) => {
//         console.log('Result: ', res);
//     })
//     .catch((err) => {
//         if (err) {
//             console.log('Error: ', err);
//         }
//     });
// failurePromise
//     .then((res) => {
//         console.log('Result: ', res);
//     })
//     .catch((err) => {
//         if (err) {
//             console.log('Error: ', err);
//         }
//     });
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
