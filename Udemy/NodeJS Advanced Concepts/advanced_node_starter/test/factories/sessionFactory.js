const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

// Mongoose의 User를 인자로 받는다.
module.exports = (user) => {
    const sessionObject = {
        passport: {
            // Mongoose의 id는 _id로 되어 있는데 이는 String이 아니다.
            // 따라서 객체 내에 정의 된 toString을 통해 id를 문자열로 만든다.
            user: user._id.toString(),
        },
    };
    const session = Buffer.from(JSON.stringify(sessionObject)).toString(
        'base64'
    );
    const sig = keygrip.sign('session=' + session);

    return {
        session,
        sig,
    };
};
