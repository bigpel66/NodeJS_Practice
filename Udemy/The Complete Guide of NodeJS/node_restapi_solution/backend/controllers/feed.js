const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.readPosts = (request, response, next) => {
    const currentPage = request.query.page || 1;
    const itemsPerPage = 2;
    let totalItems;

    Post.find()
        .countDocuments()
        .then((count) => {
            totalItems = count;

            return Post.find()
                .skip((currentPage - 1) * itemsPerPage)
                .limit(itemsPerPage);
        })
        .then((posts) => {
            return response.status(200).json({
                message: 'Fetched posts successfully',
                posts: posts,
                totalItems: totalItems,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = (request, response, next) => {
    const errors = validationResult(request);

    if (!errors) {
        const error = new Error(
            'Validation failed, entered data is incorrect.'
        );
        error.httpStatusCode = 422;
        throw error;
    }

    if (!request.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }

    const title = request.body.title;
    const content = request.body.content;
    const imageUrl = request.file.path;

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

module.exports.readPost = (request, response, next) => {
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

module.exports.updatePost = (request, response, next) => {
    const postId = request.params.postId;

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
    let imageUrl = request.body.image;

    if (request.file) {
        imageUrl = request.file.path;
    }

    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;

            return post.save();
        })
        .then((result) => {
            response
                .status(200)
                .json({ message: 'Post updated!', post: result });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

module.exports.deletePost = (request, response, next) => {
    const postId = request.params.postId;

    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            clearImage(post.imageUrl);

            return Post.findByIdAndRemove(postId);
        })
        .then((result) => {
            return response.status(200).json({ message: 'Deleted post.' });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
