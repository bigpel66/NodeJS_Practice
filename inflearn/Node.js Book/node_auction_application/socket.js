const SocketIO = require('socket.io');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });

    app.set('io', io);

    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', (socket) => {
        const req = socket.req;
        const {
            headers: { referer },
        } = req;
        const roomId = referer.split('/');
        [referer.split('/').length - 1];

        socket.join(roomId);

        socket.on('disconenct', () => {
            socket.leave();
        });
    });
};
