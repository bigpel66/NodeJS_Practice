// WEBSOCKET BASIC MODULE WS
// const WebSocket = require('ws');

// module.exports = (server) => {
//     const wss = new WebSocket.Server({ server });

//     wss.on('connection', (ws, req) => {
//         const ip =
//             req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//         console.log(`Client Connected on ${ip}`);

//         ws.on('message', (message) => {
//             console.log(message);
//         });
//         ws.on('error', (error) => {
//             console.log(error);
//         });
//         ws.on('close', () => {
//             console.log(`Client Disconnected ${ip}`);
//             clearInterval(ws.internval);
//         });

//         const interval = setInterval(() => {
//             if (ws.readyState === ws.OPEN) {
//                 ws.send('Server to Client');
//             }
//         }, 3000);
//         ws.interval = interval;
//     });
// };

// WEBSOCKET POWERFUL MODULE SOCKET.IO
const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });

    io.on('connection', (socket) => {
        const req = socket.request;
        const ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log(`Client Connected on ${ip}`);
        console.log(`Socket ID: ${socket.id}`);
        console.log(`Request IP: ${req.ip}`);

        socket.on('disconnect', () => {
            console.log(`Client Disconnected ${ip}`);
            console.log(`Socket ID: ${socket.id}`);
            clearInterval(socket.interval);
        });
        socket.on('error', (error) => {
            console.log(error);
        });
        socket.on('data', (data) => {
            console.log(data);
        });
        socket.on('reply', (reply) => {
            console.log(reply);
        });
        const interval = setInterval(() => {
            socket.emit('news', 'Server to Client');
        }, 3000);   
        socket.interval = interval;
    });
};
