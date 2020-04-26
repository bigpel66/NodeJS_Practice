const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.readPosts = async (request, response, next) => {
    const currentPage = request.query.page || 1;
    const itemsPerPage = 2;
    try {
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .populate('creator')
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        response.status(200).json({
            message: 'Fetched posts successfully',
            posts: posts,
            totalItems: totalItems,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            throw err;
        }
    }
};

exports.createPost = async (request, response, next) => {
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
        creator: request.userId,
    });

    try {
        await post.save();

        const user = await User.findById(request.userId);

        user.posts.push(post);

        await user.save();

        io.getIO().emit('posts', {
            action: 'create',
            post: {
                ...post._doc,
                creator: { _id: request.userId, name: user.name },
                createdAt: post.createdAt,
            },
        });

        return response.status(201).json({
            message: 'Post created successfully!',
            post: post,
            creator: { _id: user._id, name: user.name },
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

module.exports.readPost = async (request, response, next) => {
    const postId = request.params.postId;

    try {
        const post = await Post.findById(postId).populate('creator');

        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        response.status(200).json({ message: 'Post fetched.', post: post });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

module.exports.updatePost = async (request, response, next) => {
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

    try {
        const post = await Post.findById(postId).populate('creator');

        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        if (post.creator._id.toString() !== request.userId) {
            const error = new Error('Not authenticated.');
            error.statusCode = 403;
            throw error;
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        const resultPost = await post.save();

        io.getIO().emit('posts', { action: 'update', post: resultPost });

        response
            .status(200)
            .json({ message: 'Post updated!', post: resultPost });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

module.exports.deletePost = async (request, response, next) => {
    const postId = request.params.postId;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        if (post.creator.toString() !== request.userId) {
            const error = new Error('Not authenticated.');
            error.statusCode = 403;
            throw error;
        }

        clearImage(post.imageUrl);

        await Post.findByIdAndRemove(postId);

        const user = await User.findById(request.userId);

        user.posts.pull(postId);

        await user.save();

        response.status(200).json({ message: 'Deleted post.' });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
