const express = require('express');
const router = express.Router();
const { User, Comment } = require('../models/index');

router
    .get('/:id', async (req, res, next) => {
        try {
            const comments = await Comment.findAll({
                include: {
                    model: User,
                    where: { id: req.params.id },
                },
            });
            res.json(comments);
        } catch (err) {
            throw err;
        }
    })
    .patch('/:id', async (req, res, next) => {
        try {
            const updatedComment = await Comment.update(
                {
                    comment: req.body.comment,
                },
                { where: { id: req.params.id } }
            );
            console.log(updatedComment);
            res.json(updatedComment);
        } catch (err) {
            throw err;
        }
    })
    .delete('/:id', async (req, res, next) => {
        try {
            const deletedComment = await Comment.destroy({
                where: { id: req.params.id },
            });
            console.log(deletedComment);
            res.json(deletedComment);
        } catch (err) {
            throw err;
        }
    });

router.post('/', async (req, res, next) => {
    try {
        const createdComment = await Comment.create({
            commenter: req.body.id,
            comment: req.body.comment,
        });
        console.log(createdComment);
        res.status(201).json(createdComment);
    } catch (err) {
        throw err;
    }
});

module.exports = router;
