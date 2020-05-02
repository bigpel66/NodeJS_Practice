const expect = require('chai').expect;
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');

const feedController = require('../controllers/feed');
const env = require('../env.json');

describe('Feed Controller', function () {
    before(function (done) {
        mongoose
            .connect(env.MONGO_URL)
            .then((result) => {
                const user = new User({
                    _id: '5eaa89b07e08665c78fb6a2b',
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'tester',
                    posts: [],
                });

                return user.save();
            })
            .then(() => {
                done();
            });
    });

    after(function (done) {
        Post.deleteMany({})
            .then(() => {
                return User.deleteMany({});
            })
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });

    it('should add a created post to the post of the creator', function (done) {
        const request = {
            body: { title: 'test post title', content: 'test post content' },
            file: { path: 'test post path' },
            userId: '5eaa89b07e08665c78fb6a2b',
        };

        const response = {
            statusCode: 500,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                console.log(data);
            },
        };

        feedController
            .createPost(request, response, () => {})
            .then((savedUser) => {
                expect(savedUser).to.have.property('posts');
                expect(savedUser.posts).to.have.length(1);
                done();
            });
    });
});
