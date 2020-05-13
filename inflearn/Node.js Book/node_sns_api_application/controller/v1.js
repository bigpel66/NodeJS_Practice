const jwt = require('jsonwebtoken');
const { verifyToken } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models/index');

module.exports.postToken = async (req, res, next) => {
    const { clientSecret } = req.body;

    try {
        const domain = await Domain.findOne({
            where: {
                clientSecret,
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nickname'],
                },
            ],
        });

        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: 'No Domain Found',
            });
        }

        const token = jwt.sign(
            {
                id: domain.user.id,
                nickname: domain.user.nickname,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '5m',
                issuer: 'nodebird',
            }
        );

        return res.status(200).json({
            code: 200,
            message: 'Token Issued',
            token,
        });
    } catch (err) {
        return res.status(500).json({
            code: 500,
            message: 'Server Error',
        });
    }
};

module.exports.getTest = async (req, res, next) => {
    res.json(req.decoded);
};

module.exports.getClientPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll({ where: { userId: req.decoded.id } });

        res.json({
            code: 200,
            payload: posts,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ code: 500, message: 'Server Error' });
    }
};

module.exports.getHashtagPosts = async (req, res, next) => {
    try {
        const hashtag = await Hashtag.findOne({
            where: { title: req.params.title },
        });

        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: 'No Hashtag Found',
            });
        }

        const hashtaggedPosts = await hashtag.getPosts();

        return res.json({
            code: 200,
            payload: hashtaggedPosts,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ code: 500, message: 'Server Error' });
    }
};
