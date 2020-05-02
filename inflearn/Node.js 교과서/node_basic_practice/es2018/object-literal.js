// OBJECT LITERAL

// BEFORE ES6
var sayNode1 = function () {
    console.log('Node1');
};
var es1 = 'ES';
var object1 = {
    sayJS1: function () {
        console.log('JS1');
    },
    sayNode1: sayNode1,
};
object1[es1 + 6] = 'Fantastic';
object1.sayJS1();
object1.sayNode1();
console.log(object1.ES6);

// AFTER ES6
const sayNode2 = function () {
    console.log('Node2');
};
const es2 = 'ES';
const object2 = {
    sayJS2() {
        console.log('JS2');
    },
    sayNode2,
    [es2 + 6]: 'Fantastic',
};
object2.sayJS2();
object2.sayNode2();
console.log(object2.ES6);
