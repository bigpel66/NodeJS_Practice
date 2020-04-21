const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    },
});

const fileFileter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
app.use(bodyParser.json());
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFileter,
    }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    );
    response.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

app.use('/feed', feedRoutes);

app.use((error, request, response, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.messgae;

    response.status(status).json({ message: message });
});

mongoose
    .connect(
        'mongodb+srv://bigpel66:JasonSeo@cluster0-2e6no.mongodb.net/messages?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then((result) => {
        app.listen(8080);
    })
    .catch((err) => {
        if (errr) {
            console.log(err);
        }
    });
