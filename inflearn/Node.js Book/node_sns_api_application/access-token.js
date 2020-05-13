let accessToken;

module.exports = {
    tokenize(token) {
        accessToken = token;
    },
    readToken() {
        return accessToken;
    },
};
