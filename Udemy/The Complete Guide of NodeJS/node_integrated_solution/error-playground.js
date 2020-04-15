// testing function prototype
const sum = (a, b) => {
    if (a && b) {
        return a + b;
    } else {
        throw new Error('Invalid Arguments');
    }
};

// test1 - full parameters
// no error
console.log(sum(1, 2));

// test2 - not full parameters with no catch error
// error
console.log(sum(1));

// test3 - not full paramter with catch error
try {
    console.log(sum(1));
} catch (error) {
    if (error) {
        console.log(error);
    }
}

// this will only work on test 1 and 3
// this will not work on test 2, because app will be crashed by error
console.log('does this work after error?');
