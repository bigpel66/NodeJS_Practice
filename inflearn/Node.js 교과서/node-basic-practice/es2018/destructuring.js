// DESTRUCTURING

// BEFORE ES6
var candyMachine1 = {
    status1: {
        name: 'node',
        count: 5,
    },
    getCandy1: function () {
        this.status1.count--;
        console.log(this.status1.count);
        return this.status1.count;
    },
};
var status1 = candyMachine1.status1;
var getCandy1 = candyMachine1.getCandy1;
console.log(status1);
getCandy1(); // Does not work
getCandy1.bind(candyMachine1)();
getCandy1.call(candyMachine1);

// AFTER ES6
const candyMachine2 = {
    status2: {
        name: 'node',
        count: 5,
    },
    getCandy2() {
        this.status2.count--;
        console.log(this.status2.count);
        return this.status2.count;
    },
};
const { status2, getCandy2 } = candyMachine2;
console.log(status2);
getCandy2(); // Does not work
getCandy2.bind(candyMachine2)();
getCandy2.call(candyMachine2);

// ARRAY DESTRUCTURING
const array1 = ['node', {}, 10, true];
const [node1, obj1, , bool] = array1;
console.log(node1);
console.log(obj1);
console.log(bool);

// ARGUMENTS KEYWORD
var args = [1, 2, 3, 4, 5];
function o() {
    console.log(arguments);
}
o(args);

// SPREAD OPERATOR EXAMPLE 1
const array2 = ['node', {}, 10, true];
const [node2, obj2, ...rest] = array2;
console.log(node2);
console.log(obj2);
console.log(rest);

// SPREAD OPERATOR EXAMPLE 2
const m = (x, y) => console.log(x, y);
m(5, 6);
const n = (x, ...y) => console.log(x, y);
n(5, 6, 7, 8, 9);
