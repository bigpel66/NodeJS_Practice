const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const indexController = require('../controller/index');

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
    if (
        // ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.mimetype)
        file.mimetype === 'image/gif'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage, limits, fileFilter });

fs.readdir('uploads', (err) => {
    if (err) {
        console.log('Directory Created');
        fs.mkdirSync('uploads');
    }
});

router.get('/', indexController.getMain);

router
    .get('/room', indexController.getRoom)
    .post('/room', indexController.postRoom);

router
    .get('/room/:id', indexController.getRoomDetail)
    .delete('/room/:id', indexController.deleteRoomDetail);

router.post('/room/:id/chat', indexController.postChat);

router.post('/room/:id/gif', upload.single('gif'), indexController.postGIF);

module.exports = router;
