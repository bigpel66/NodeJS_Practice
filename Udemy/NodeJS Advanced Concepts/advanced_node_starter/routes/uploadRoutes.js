const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/../config/awsConfig.json');
const s3 = new AWS.S3();

module.exports = (app) => {
    app.get('/api/upload', requireLogin, (req, res) => {
        const fileType = req.query.type;
        const type = fileType.split('/')[1];

        const key = `${req.user.id}/${uuid()}.${type}`;
        s3.getSignedUrl(
            'putObject',
            {
                Bucket: 'bigpel66-blogster',
                ContentType: fileType,
                Key: key,
            },
            (err, url) => {
                if (err) {
                    throw err;
                }

                return res.send({ key, url });
            }
        );
    });
};
