const { validationResult } = require('express-validator/check');

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
    const title = request.body.title;
    const content = request.body.content;

    const errors = validationResult(request);

    if (!errors) {
        return response.status(422).json({
            message: 'Validation failed, entered data is incorrect.',
            errors: errors.array(),
        });
    }

    response.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: { name: 'Jason Seo' },
            createdAt: new Date(),
        },
    });
};
