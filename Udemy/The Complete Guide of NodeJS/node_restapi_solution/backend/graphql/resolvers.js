const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Post = require('../models/post');

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

    readPosts: async function (args, request) {
        if (!request.isAuth) {
            const error = new Error('Not authenticated.');
            error.code = 401;
            throw error;
        }

        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
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
};
