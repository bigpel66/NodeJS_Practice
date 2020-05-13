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
                expiresIn: '5min',
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
