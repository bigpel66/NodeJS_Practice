const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const extname = path.extname(file.originalname);
        console.log(file.originalname);
        console.log(extname);
        console.log(path.basename(file.originalname, extname));
        console.log(new Date().valueOf());
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

const upload = multer({ storage, fileFilter, limits });

module.exports.postImage = (req, res, next) => {
    upload.single('img')(req, res, next);
};

module.exports.postImageRespond = (req, res, next) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` });
};
