const axios = require('axios');
const request = require('../helpers/request');

module.exports.getTest = async (req, res, next) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post(
                'http://localhost:8081/v1/token',
                {
                    clientSecret: process.env.CLIENT_SECRET,
                }
            );

            if (tokenResult.data && tokenResult.data.code === 200) {
                req.session.jwt = tokenResult.data.token;
            } else {
                return res.json(tokenResult.data);
            }
        }

        const result = await axios.get('http://localhost:8081/v1/test', {
            headers: {
                Authorization: req.session.jwt,
            },
        });

        return res.json(result.data);
    } catch (err) {
        console.error(err);
        if (err.response.status === 419) {
            return res.json(err.response.data);
        }
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
