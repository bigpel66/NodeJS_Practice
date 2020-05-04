const util = require('util');
const crypto = require('crypto');

// DEPRECATE
const doNotUseMe = util.deprecate((x, y) => {
    console.log(x + y);
}, '이 함수는 조만간 지원이 중단됩니다.');

doNotUseMe(1, 2);

// PROMISIFY
// Before Promisify
crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
        console.log('key from Callback Function: ', key.toString('base64'));
    });
});

// After Promisify
const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);
// THEN CATCH
randomBytesPromise(64)
    .then((result) => {
        const salt = result.toString('base64');
        return pbkdf2Promise('비밀번호', salt, 100000, 64, 'sha512');
    })
    .then((key) => {
        console.log('key from Then Catch: ', key.toString('base64'));
    })
    .catch((err) => {
        if (err) {
            console.error(err);
        }
    });
// ASYNC AWAIT
(async () => {
    const buf = await randomBytesPromise(64);
    const salt = buf.toString('base64');
    const key = await pbkdf2Promise('비밀번호', salt, 100000, 64, 'sha512');
    console.log('key from Async Await: ', key.toString('base64'));
})();
