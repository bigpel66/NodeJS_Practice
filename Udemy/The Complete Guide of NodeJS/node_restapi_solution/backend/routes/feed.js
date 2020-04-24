const express = require('express');
const { body } = require('express-validator/check');

const isAuth = require('../middleware/isAuth');
const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/posts', isAuth, feedController.readPosts);

router.post(
    '/post',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 }),
    ],
    isAuth,
    feedController.createPost
);

router.get('/post/:postId', isAuth, feedController.readPost);

router.put(
    '/post/:postId',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 }),
    ],
    feedController.updatePost
);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;
