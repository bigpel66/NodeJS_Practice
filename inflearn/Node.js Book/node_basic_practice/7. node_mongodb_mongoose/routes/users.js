const express = require('express');
const router = express.Router();
const User = require('../models/user');

router
    .get('/', async (req, res, next) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            throw err;
        }
    })
    .post('/', async (req, res, next) => {
        try {
            const user = new User({
                name: req.body.name,
                age: req.body.age,
                married: req.body.married,
            });
            const createdUser = await user.save();
            console.log(createdUser);

            res.status(201).json(createdUser);
        } catch (err) {
            throw err;
        }
    });

module.exports = router;
