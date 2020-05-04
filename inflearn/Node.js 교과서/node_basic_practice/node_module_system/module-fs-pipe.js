const fs = require('fs');

const readStream = fs.createReadStream('../files/READPIPE.txt');
const writeStream = fs.createWriteStream('../files/WRITEPIPE.txt');

readStream.pipe(writeStream);

const copyStream = fs.copyFile(
    '../files/READCOPYFILE.txt',
    '../files/WRITECOPYFILE.txt',
    (err) => {
        if (err) {
            console.log(err);
        }
    }
);
