const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const indexController = require('../controller/index');
const { isLoggedIn, isNotLoggedIn } = require('../controller/middleware');

const router = express.Router();

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
const limits = { fileSize: 10 * 1024 * 1024 };
const fileFilter = (req, file, cb) => {
    if (['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({ storage, limits, fileFilter });

fs.readdir('uploads', (err) => {
    if (err) {
        console.error('Uploading Directory Created');
        fs.mkdirSync('uploads');
    }
});

router.use(indexController.getUser);

router.get('/', indexController.getMain);

router.get('/join', isNotLoggedIn, indexController.getJoin);

router
    .get('/good', isLoggedIn, indexController.getGood)
    .post('/good', isLoggedIn, upload.single('img'), indexController.postGood);

router.get('/good/:id', isLoggedIn, indexController.getGoodDetail);

router.post('/good/:id/bid', isLoggedIn, indexController.postGoodDetailBid);

module.exports = router;
