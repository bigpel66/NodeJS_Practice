const local = require('./local-strategy');
const kakao = require('./kakao-strategy');

module.exports = (passport) => {
    local(passport);
    kakao(passport);
};
