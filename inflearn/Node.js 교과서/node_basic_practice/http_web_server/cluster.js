const http = require('http');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log('PID of Master Process: ', process.pid);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(worker.process.pid, 'is Terminated!');
        cluster.fork();
    });
} else {
    http.createServer((req, res) => {
        res.end('Http Server');
        console.log(process.pid, 'is Started!');
        setTimeout(() => {
            console.log(process.pid, 'is Terminated!');
            process.exit(1);
        }, 1000);
    }).listen(8080, () => {
        console.log('Server Running with PID: ', process.pid);
    });
}
