// WEBSOCKET BASIC PRACTICE
// WS PACKAGE
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
// SOCKET.IO PACKAGE
// const SocketIO = require('socket.io');

// module.exports = (server) => {
//     const io = SocketIO(server, { path: '/socket.io' });

//     io.on('connection', (socket) => {
//         const req = socket.request;
//         const ip =
//             req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//         console.log(`Client Connected on ${ip}`);
//         console.log(`Socket ID: ${socket.id}`);
//         console.log(`Request IP: ${req.ip}`);

//         socket.on('disconnect', () => {
//             console.log(`Client Disconnected ${ip}`);
//             console.log(`Socket ID: ${socket.id}`);
//             clearInterval(socket.interval);
//         });
//         socket.on('error', (error) => {
//             console.log(error);
//         });
//         socket.on('data', (data) => {
//             console.log(data);
//         });
//         socket.on('reply', (reply) => {
//             console.log(reply);
//         });
//         const interval = setInterval(() => {
//             socket.emit('news', 'Server to Client');
//         }, 3000);
//         socket.interval = interval;
//     });
// };

const axios = require('axios');
const SocketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });

    app.set('io', io);

    const room = io.of('/room');
    const chat = io.of('/chat');

    io.use((socket, next) => {
        cookieParser(process.env.COOKIE_SECRET)(
            socket.request,
            socket.request.res,
            next
        );
    });

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    room.on('connection', (socket) => {
        console.log(`Access Namespace 'room'`);
        socket.on('disconnect', () => {
            console.log(`Leave Namespace 'room'`);
        });
    });

    chat.on('connection', async (socket) => {
        console.log(`Access Namespace 'chat'`);

        const req = socket.request;
        const {
            headers: { referer },
        } = req;
        const roomId = referer
            .split('/')
            [referer.split('/').length - 1].replace(/\?.+/, '');

        socket.join(roomId);

        await axios.post(
            `http://localhost:8080/room/${roomId}/system`,
            {
                type: 'join',
            },
            {
                headers: {
                    Cookie: `connect.sid=${
                        's%3A' +
                        cookie.sign(
                            req.signedCookies['connect.sid'],
                            process.env.COOKIE_SECRET
                        )
                    }`,
                },
            }
        );
        // socket.to(roomId).emit('join', {
        //     user: 'system',
        //     chat: `${req.session.color} has entered.`,
        //     number: socket.adapter.rooms[roomId].length,
        // });

        socket.on('disconnect', async () => {
            console.log(`Leave Namespace 'chat'`);
            socket.leave(roomId);
            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;

            if (userCount === 0) {
                try {
                    await axios.delete(`http://localhost:8080/room/${roomId}`);

                    console.log(`${roomId} has been deleted.`);
                } catch (err) {
                    console.error(err);
                }
            } else {
                await axios.post(
                    `http://localhost:8080/room/${roomId}/system`,
                    {
                        type: 'exit',
                    },
                    {
                        headers: {
                            Cookie: `connect.sid=${
                                's%3A' +
                                cookie.sign(
                                    req.signedCookies['connect.sid'],
                                    process.env.COOKIE_SECRET
                                )
                            }`,
                        },
                    }
                );
                // socket.to(roomId).emit('exit', {
                //     user: 'system',
                //     chat: `${req.session.color} has left.`,
                //     number: socket.adapter.rooms[roomId].length,
                // });
            }
        });
    });
};
