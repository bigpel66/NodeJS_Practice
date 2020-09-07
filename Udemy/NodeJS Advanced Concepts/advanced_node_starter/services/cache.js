const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
    // caching on redis here

    return exec.apply(this, arguments);
};
