const util = require('util');
const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const redisClient = redis.createClient(redisUrl);
const exec = mongoose.Query.prototype.exec;

// redisClient.get = util.promisify(redisClient.get);
redisClient.hget = util.promisify(redisClient.hget);

// 만일 Caching을 할 것이라면 인자로 최상위 부분의 Key 값을 받도록 한다.
// Key는 Nested Hash Object 형태지만, Redis에 저장되므로 Numbers, Strings만 가능하다.
// 혹여나 주어지는 Key가 Object일 수 있기 때문에 JSON.stringify 해준다.
// Key가 주어지지 않았을 경우를 대비해 default 값을 지정해준다.
mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
};

mongoose.Query.prototype.exec = async function () {
    // caching on redis here

    // Cache 여부 판별
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    // Cache Key로 활용
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name);

    // JSON.stringify 필요
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name,
        })
    );

    // REDIS에 Key가 있는지 확인 후, 있으면 Value 리턴
    // const cacheValue = await redisClient.get(key);
    const cacheValue = await redisClient.hget(this.hashKey, key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc)
            ? doc.map((d) => {
                  return new this.model(d);
              })
            : new this.model(doc);
    }

    // 없다면 Query 수행하고 해당 값을 REDIS에 저장
    const result = await exec.apply(this, arguments);

    //  Duration 추가
    // redisClient.set(key, JSON.stringify(result), 'EX', 10);
    redisClient.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

    return result;
};

// 어떤 데이터가 저장되어 있든 해쉬 키에 해당하는 Bucket의 모든 데이터를 지운다.
// 이 때 clearHash의 인자로 주어진 인자가 Object일 수 있으므로 JSON.stringify 해준다.
module.exports = {
    clearHash(hashKey) {
        redisClient.del(JSON.stringify(hashKey));
    },
};
