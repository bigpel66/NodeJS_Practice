const util = require('util');
const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const redisClient = redis.createClient(redisUrl);
const exec = mongoose.Query.prototype.exec;

redisClient.get = util.promisify(redisClient.get);

mongoose.Query.prototype.cache = function () {
    this.useCache = true;

    return this;
};

mongoose.Query.prototype.exec = async function () {
    // caching on redis here

    // Cache 여부 판별
    if (!this.useCache) {
        console.log('not cached');
        return exec.apply(this, arguments);
    }

    console.log('cached');

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
    const cacheValue = await redisClient.get(key);

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

    redisClient.set(key, JSON.stringify(result));

    return result;
};
