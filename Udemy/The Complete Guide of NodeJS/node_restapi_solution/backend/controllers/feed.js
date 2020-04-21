const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (request, response, next) => {
    Post.find()
        .then((posts) => {
            return response
                .status(200)
                .json({ message: 'Fetched posts successfully', posts: posts });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
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

module.exports.getPost = (request, response, next) => {
    const postId = request.params.postId;

    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('Could not find post.');

                error.statusCode = 404;

                throw error;
            }

            return response
                .status(200)
                .json({ message: 'Post fetched.', post: post });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
