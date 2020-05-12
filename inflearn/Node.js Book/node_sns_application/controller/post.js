const path = require('path');
const multer = require('multer');
const { Post, Hashtag } = require('../models/index');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(
            null,
            path.basename(file.originalname, extname) +
                new Date().valueOf() +
                extname
        );
    },
});
const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const limits = {
    fileSize: 10 * 1024 * 1024,
};

const upload1 = multer({ storage, fileFilter, limits });
const upload2 = multer();

module.exports.postWithImage = (req, res, next) => {
    upload1.single('img')(req, res, next);
};

module.exports.postWithoutImage = (req, res, next) => {
    upload2.none()(req, res, next);
};

module.exports.postImageRespond = (req, res, next) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};

module.exports.postText = async (req, res, next) => {
    try {
        const newPost = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);

        if (hashtags) {
            const results = await Promise.all(
                hashtags.map((hashtag) => {
                    return Hashtag.findOrCreate({
                        where: { title: hashtag.slice(1).toLowerCase() },
                    });
                })
            );

            await newPost.addHashtags(
                results.map((result) => {
                    return result[0];
                })
            );
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};
