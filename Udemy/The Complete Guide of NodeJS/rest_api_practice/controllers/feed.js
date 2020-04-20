exports.getPosts = (request, response, next) => {
    response.status(200).json({
        posts: [
            { title: 'First Post', content: 'This is the first post!' },
            { title: 'Second Post', content: 'Second post with first one' },
        ],
    });
};

exports.postPosts = (request, response, next) => {
    const title = request.body.title;
    const content = request.body.content; 

    console.log(title);
    console.log(content);

    response.status(201).json({
        message: 'Post created successfully!',
        post: { id: new Date().toISOString(), title: title, content: content },
    });
};
