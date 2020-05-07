// PROMISE

// PROMISE CHAINING
const promise = new Promise((resolve, reject) => {
    const a = 1;
    const b = 3;
    if (a + b > 2) {
        resolve(a + b);
    } else {
        reject(a + b);
    }
});
promise
    .then((res) => {
        console.log('First Result: ', res);
        return new Promise((resolve, reject) => {
            const a = 2;
            const b = 2;
            if (a * b == 2) {
                resolve(a * b);
            } else {
                reject(a * b);
            }
        });
    })
    .then((res) => {
        console.log('Second Result: ', res);
    })
    .catch((err) => {
        if (err) {
            console.log('An Error: ', err);
        }
    });

// SHORTER PROMISE RESOLVE AND REJECT
const successPromise = Promise.resolve('success');
const failurePromise = Promise.reject('failure');
successPromise
    .then((res) => {
        console.log('Result: ', res);
    })
    .catch((err) => {
        if (err) {
            console.log('Error: ', err);
        }
    });
failurePromise
    .then((res) => {
        console.log('Result: ', res);
    })
    .catch((err) => {
        if (err) {
            console.log('Error: ', err);
        }
    });

// PROMISE ALL METHOD
const firstPromise = Promise.resolve('first');
const secondPromise = Promise.resolve('second');
const thirdPromise = Promise.resolve('third');
const errorPromise = Promise.reject('error');
Promise.all([firstPromise, secondPromise, thirdPromise, errorPromise])
    .then((res) => {
        console.log('Result: ', res);
    })
    .catch((err) => {
        if (err) {
            console.log('Error: ', err);
        }
    });
