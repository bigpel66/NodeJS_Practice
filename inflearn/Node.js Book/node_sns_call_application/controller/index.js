const axios = require('axios');
const request = require('../helpers/request');

module.exports.getMain = (req, res, next) => {
    res.render('main', {
        key: process.env.CLIENT_SECRET,
    });
};

module.exports.getTest = async (req, res, next) => {
    try {
        const result = await request(req, 'test');

        res.json(result.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getClientPosts = async (req, res, next) => {
    try {
        const result = await request(req, 'client/posts');

        res.json(result.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getHashtagPosts = async (req, res, next) => {
    try {
        const result = await request(
            req,
            `hashtag/${encodeURIComponent(req.params.hashtag)}/posts`
        );

        res.json(result.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getFollowList = async (req, res, next) => {
    try {
        const result = await request(req, 'follow');

        res.json(result.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// NOT FOR THE FRONT REQUEST, ONLY FOR THE BACKEND REQUEST
module.exports.setHeader = (req, res, next) => {
    axios.defaults.headers.origin = process.env.ORIGIN_URL;
    next();
};
