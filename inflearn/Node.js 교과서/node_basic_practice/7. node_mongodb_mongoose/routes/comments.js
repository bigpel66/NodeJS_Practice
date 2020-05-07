const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const Comment = require('../models/comment');

router
    .get('/:id', async (req, res, next) => {
        try {
            const comments = await Comment.find({
                commenter: new mongodb.ObjectId(req.params.id),
            });

            console.log(1);

            res.json(comments);
        } catch (err) {
            throw err;
        }
    })
    .patch('/:id', async (req, res, next) => {
        try {
            const updatedComment = await Comment.update(
                { _id: new mongodb.ObjectId(req.params.id) },
                { comment: req.body.comment }
            );
            console.log(updatedComment);

            res.json(updatedComment);
        } catch (err) {
            throw err;
        }
    })
    .delete('/:id', async (req, res, next) => {
        try {
            const deletedComment = await Comment.remove({
                _id: new mongodb.ObjectId(req.params.id),
            });
            console.log(deletedComment);

            res.json(deletedComment);
        } catch (err) {
            throw err;
        }
    });

router.post('/', async (req, res, next) => {
    try {
        const comment = new Comment({
            commenter: new mongodb.ObjectId(req.body.id),
            comment: req.body.comment,
        });
        const createdComment = await comment.save();
        console.log(createdComment);

        res.status(201).json(createdComment);
    } catch (err) {
        throw err;
    }
});

module.exports = router;
