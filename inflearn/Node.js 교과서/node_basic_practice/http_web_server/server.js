const http = require('http');

const server = http
    .createServer((req, res) => {
        console.log('Server Start');
        res.write('<h1>Hello Node.js</h1>');
        res.write('<h2>This is JavaScript</h2>');
        res.write('<h2>This is JavaScript</h2>');
        res.write('<h2>This is JavaScript</h2>');
        res.write('<h2>This is JavaScript</h2>');
        res.end('<p>Hello Server!</p>');
    })
    .listen(8080);

server.on('listening', () => {
    console.log('Port Number: 8080 Running');
});

server.on('error', (err) => {
    console.log(err);
});
