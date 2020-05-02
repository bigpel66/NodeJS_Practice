// ARROW Function

// BEFORE ES6
var add1 = function (x, y) {
    return x + y;
};
var result1 = add1(2, 3);
console.log(result1);

// AFTER ES6
let add2 = (x, y) => {
    return x + y;
};
let result2 = add2(2, 3);
console.log(result2);

// THIS ON FUNCTION () {}
var relationship1 = {
    name: 'J',
    friends: ['S', 'K', 'L'],
    logFriends: function () {
        var that = this;
        this.friends.forEach(function (friend) {
            console.log(that.name, friend); // function 내부의 this와 외부의 this가 서로 다르기 때문에 that에 넣어서 사용한다.
        });
    },
};
relationship1.logFriends();

// THIS ON ARROW FUNCTION
const relationship2 = {
    name: 'J',
    friends: ['S', 'K', 'L'],
    logFriends() {
        this.friends.forEach((friend) => {
            console.log(this.name, friend); // Arrow Function 덕에 내부의 this와 외부의 this가 서로 동일하게 취급된다.
        });
    },
};
relationship2.logFriends();
