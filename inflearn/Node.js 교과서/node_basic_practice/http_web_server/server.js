const http = require('http');
const fs = require('fs');

const server = http
    .createServer((req, res) => {
        console.log('Server Start');
        fs.readFile('./server.html', (err, data) => {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    })
    .listen(8080);

server.on('listening', () => {
    console.log('Port Number: 8080 Running');
});

server.on('error', (err) => {
    console.log(err);
});
