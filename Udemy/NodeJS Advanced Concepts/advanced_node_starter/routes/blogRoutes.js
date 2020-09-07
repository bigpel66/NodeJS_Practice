const util = require('util');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = (app) => {
    app.get('/api/blogs/:id', requireLogin, async (req, res) => {
        const blog = await Blog.findOne({
            _user: req.user.id,
            _id: req.params.id,
        });

        res.send(blog);
    });

    app.get('/api/blogs', requireLogin, async (req, res) => {
        // before monkey patch of mongoose library on cache.js
        // const redis = require('redis');
        // const redisUrl = 'redis://127.0.0.1:6379';
        // const redisClient = redis.createClient(redisUrl);
        // // 해당 Query가 Redis에 Caching되어 있는지 확인
        // // // const cachedBlogs = client.get(req.user.id, () => {});
        // // // 위 구문은 바람직 하지 않음 Promisify가 필요
        // redisClient.get = util.promisify(redisClient.get);
        // const cachedBlogs = await redisClient.get(req.user.id);
        // // Caching되어 있다면, Redis로부터 즉시 응답 수신
        // // JSON.parse
        // if (cachedBlogs) {
        //     console.log('Serving FROM REDIS');
        //     return res.send(JSON.parse(cachedBlogs));
        // }
        // // Caching되어 있지 않다면, Query를 DB로 직접 송신
        // // Redis Caching 데이터 생성 필요
        // // JSON.stringify
        // const blogs = await Blog.find({ _user: req.user.id });
        // console.log('Serving FROM MONGO');
        // res.send(blogs);
        // redisClient.set(req.user.id, JSON.stringify(blogs));

        const blogs = await Blog.find({ _user: req.user.id });

        res.send(blogs);
    });

    app.post('/api/blogs', requireLogin, async (req, res) => {
        const { title, content } = req.body;

        const blog = new Blog({
            title,
            content,
            _user: req.user.id,
        });

        try {
            await blog.save();
            res.send(blog);
        } catch (err) {
            res.send(400, err);
        }
    });
};
