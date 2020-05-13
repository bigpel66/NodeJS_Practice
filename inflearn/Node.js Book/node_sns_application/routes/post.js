const fs = require('fs');
const express = require('express');
const postController = require('../controller/post');
const { isLoggedIn, isNotLoggedIn } = require('../controller/middlewares');

const router = express.Router();

fs.readdir('uploads', (error) => {
    if (error) {
        console.error('Upload Folder Generated');
        fs.mkdirSync('uploads');
    }
});

router.post(
    '/img',
    isLoggedIn,
    postController.postWithImage,
    postController.postImageRespond
);

router.post(
    '/',
    isLoggedIn,
    postController.postWithoutImage,
    postController.postText
);

router.get('/hashtag', postController.getHashtags);

module.exports = router;
