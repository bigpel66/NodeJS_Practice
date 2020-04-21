const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (request, response, next) => {
    response.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/wallpaper.jpg',
                creator: {
                    name: 'Jason Seo',
                },
                createdAt: new Date(),
            },
            {
                _id: '2',
                title: 'Second Post',
                content: 'Second post with first one',
                imageUrl: 'images/couch.jpg',
                creator: {
                    name: 'Jason Seo',
                },
                createdAt: new Date(),
            },
        ],
    });
};

exports.postPosts = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors) {
        const error = new Error(
            'Validation failed, entered data is incorrect.'
        );

        error.httpStatusCode = 422;

        throw error;
    }

    const title = request.body.title;
    const content = request.body.content;
    const imageUrl = 'images/wallpaper.jpg';

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: { name: 'Jason Seo' },
    });

    post.save()
        .then((post) =>
            response.status(201).json({
                message: 'Post created successfully!',
                post: post,
            })
        )
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }

            next(err);
        });
};
