const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

const { clearImage } = require('../utility/file');

module.exports = {
    createUser: async function ({ userInput }, request) {
        const errors = [];

        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-Mail is invalid.' });
        }

        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })
        ) {
            errors.push({ message: 'Password too short!' });
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;

            throw error;
        }

        const existingUser = await User.findOne({ email: userInput.email });

        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }

        const hashedPassword = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPassword,
        });
        const createdUser = await user.save();

        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },

    login: async function ({ email, password }) {
        const errors = [];
        const user = await User.findOne({ email: email });

        if (!validator.isEmail(email)) {
            errors.push({ message: 'E-Mail is invalid.' });
        }

        if (
            validator.isEmpty(password) ||
            !validator.isLength(password, { min: 5 })
        ) {
            errors.push({ message: 'Password too short!' });
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;

            throw error;
        }

        if (!user) {
            const error = new Error('User not found.');
            error.code = 401;
            throw error;
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            const error = new Error('Password is incorrect.');
            error.code = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
            },
            'somesupersecretkeyvalue',
            { expiresIn: '1h' }
        );

        return { token: token, userId: user._id.toString() };
    },

    createPost: async function ({ postInput }, request) {
        if (!request.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 401;
            throw error;
        }

        const errors = [];

        if (
            validator.isEmpty(postInput.title) ||
            !validator.isLength(postInput.title, { min: 5 })
        ) {
            errors.push({ message: 'Title is invalid.' });
        }

        if (
            validator.isEmpty(postInput.content) ||
            !validator.isLength(postInput.content, { min: 5 })
        ) {
            errors.push('Content is invalid.');
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findById(request.userId);

        if (!user) {
            const error = new Error('Invalid user.');
            error.code = 401;
            throw error;
        }

        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            creator: user,
        });

        const createdPost = await post.save();

        user.posts.push(createdPost);

        await user.save();

        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString(),
        };
    },

    readPosts: async function ({ page }, request) {
        if (!request.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 401;
            throw error;
        }

        if (!page) {
            page = 1;
        }

        const perPage = 2;

        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('creator');

        return {
            totalPosts: totalPosts,
            posts: posts.map((post) => {
                return {
                    ...post._doc,
                    _id: post._id.toString(),
                    createdAt: post.createdAt.toISOString(),
                    updatedAt: post.updatedAt.toISOString(),
                };
            }),
        };
    },

    readPost: async function ({ id }, request) {
        if (!request.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 401;
            throw error;
        }

        const post = await Post.findById(id).populate('creator');

        if (!post) {
            const error = new Error('No post found.');
            error.code = 404;
            throw error;
        }

        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    },

    updatePost: async function ({ id, postInput }, request) {
        if (!request.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 401;
            throw error;
        }

        const post = await Post.findById(id).populate('creator');

        if (!post) {
            const error = new Error('No post found!');
            error.code = 404;
            throw error;
        }

        if (post.creator._id.toString() !== request.userId) {
            const error = new Error('Not authorized!');
            error.code = 403;
            throw error;
        }

        const errors = [];

        if (
            validator.isEmpty(postInput.title) ||
            !validator.isLength(postInput.title, { min: 5 })
        ) {
            errors.push({ message: 'Title is invalid.' });
        }

        if (
            validator.isEmpty(postInput.content) ||
            !validator.isLength(postInput.content, { min: 5 })
        ) {
            errors.push('Content is invalid.');
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        post.title = postInput.title;
        post.content = postInput.content;

        if (postInput.imageUrl !== 'undefined') {
            post.imageUrl = postInput.imageUrl;
        }

        const updatedPost = await post.save();

        return {
            ...updatedPost._doc,
            _id: updatedPost._id.toString(),
            createdAt: updatedPost.createdAt.toISOString(),
            updatedAt: updatedPost.updatedAt.toISOString(),
        };
    },

    deletePost: async function ({ id }, request) {
        if (!request.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 401;
            throw error;
        }

        const post = await Post.findById(id);

        if (!post) {
            const error = new Error('No post found.');
            error.code = 404;
            throw error;
        }

        if (post.creator.toString() !== request.userId) {
            const error = new Error('Not authorized.');
            error.code = 403;
            throw error;
        }

        clearImage(post.imageUrl);

        await Post.findByIdAndRemove(id);

        const user = await User.findById(request.userId);

        user.posts.pull(id);

        await user.save();

        return true;
    },

    user: async function (args, request) {
        if (!request.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 401;
            throw error;
        }

        const user = await User.findById(request.userId);

        if (!user) {
            const error = new Error('No user found.');
            error.code = 404;
            throw error;
        }

        return { ...user._doc, _id: user._id.toString() };
    },

    updateStatus: async function ({ status }, request) {
        if (!request.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 401;
            throw error;
        }

        const user = await User.findById(request.userId);

        if (!user) {
            const error = new Error('No user found.');
            error.code = 404;
            throw error;
        }

        user.status = status;

        const updatedUser = await user.save();

        return {
            ...updatedUser._doc,
            _id: updatedUser._id.toString(),
        };
    },
};
