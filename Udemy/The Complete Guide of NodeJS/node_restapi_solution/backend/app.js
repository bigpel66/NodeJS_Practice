const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

// DELETED TO USE GRAPHQL
// const feedRoutes = require('./routes/feed');
// const authRoutes = require('./routes/auth');

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
    if (request.method === 'OPTIONS') {
        return response.sendStatus(200);
    }
    next();
});

app.use(
    '/graphql',
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,
        customFormatError(err) {
            if (!err.originalError) {
                return err;
            }

            const data = err.originalError.data;
            const code = err.originalError.code || 500;
            const message = err.message || 'An error occurred.';

            return {
                message: message,
                status: code,
                data: data,
            };
        },
    })
);
// DELETED TO USE GRAPHQL
// app.use('/feed', feedRoutes);
// app.use('/auth', authRoutes);

app.use((error, request, response, next) => {
    const status = error.statusCode || 500;
    const message = error.messgae;
    const data = error.data;
    response.status(status).json({ message: message, data: data });
});

mongoose
    .connect(
        'mongodb+srv://bigpel66:JasonSeo@cluster0-2e6no.mongodb.net/messages?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then((result) => {
        app.listen(8080);
        // DELETED TO USE GRAPHQL
        // const server = app.listen(8080);
        // const io = require('./socket').init(server);
        // io.on('connection', (socket) => {
        //     console.log('Client connected.');
        // });
    })
    .catch((err) => {
        if (err) {
            console.log(err);
        }
    });
