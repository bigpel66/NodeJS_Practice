const express = require('express');
const router = express.Router();
const { User } = require('../models/index');

router
    .get('/', async (req, res, next) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (err) {
            throw err;
        }
    })
    .post('/', async (req, res, next) => {
        try {
            const createdUser = await User.create({
                name: req.body.name,
                age: req.body.age,
                married: req.body.married,
            });
            console.log(createdUser);
            res.status(201).json(createdUser);
        } catch (err) {
            throw err;
        }
    });

module.exports = router;
