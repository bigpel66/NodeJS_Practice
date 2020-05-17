const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

module.exports.getMain = async (req, res, next) => {
    try {
        const rooms = await Room.find({});

        res.render('main', {
            rooms,
            title: 'GIF Chat',
            error: req.flash('roomError'),
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getRoom = (req, res, next) => {
    res.render('room', {
        title: 'Creating Channel',
    });
};
module.exports.postRoom = async (req, res, next) => {
    try {
        const room = new Room({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password,
        });

        const newRoom = await room.save();
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        return res.redirect(
            `/room/${newRoom._id}?password=${req.body.password}`
        );
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getRoomDetail = async (req, res, next) => {
    try {
        const room = await Room.findOne({ _id: req.params.id });
        const io = req.app.get('io');

        if (!room) {
            req.flash('roomError', 'No Channel Found');
            return res.redirect('/');
        }

        if (room.password && room.password !== req.query.password) {
            req.flash('roomError', 'Invalid Password');
            return res.redirect('/');
        }

        const { rooms } = io.of('/chat').adapter;

        if (
            rooms & rooms[req.params.id] &&
            room.max <= rooms[req.params.id].length
        ) {
            req.flash('roomError', 'Full Channel');
            return res.redirect('/');
        }

        const chats = await Chat.find({ room: room._id }).sort('createdAt');

        return res.render('chat', {
            room,
            chats,
            title: room.title,
            user: req.session.color,
            number:
                (rooms &&
                    rooms[req.params.id] &&
                    rooms[req.params.id].length + 1) ||
                1,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.deleteRoomDetail = async (req, res, next) => {
    try {
        await Room.deleteOne({ _id: req.params.id });
        await Chat.deleteMany({ room: req.params.id });

        res.send('Channel Deleted');

        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        }, 2000);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.postChat = async (req, res, next) => {
    try {
        const chat = new Chat({
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat,
        });

        await chat.save();

        const io = req.app.get('io');

        io.of('/chat').to(req.params.id).emit('chat', chat);

        res.send('Chat Sent');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.postGIF = async (req, res, next) => {
    try {
        const chat = new Chat({
            room: req.params.id,
            user: req.session.color,
            gif: req.file.filename,
        });

        await chat.save();

        const io = req.app.get('io');

        io.of('/chat').to(req.params.id).emit('chat', chat);

        res.send('GIF Sent');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.postSystem = async (req, res, next) => {
    try {
        const chat =
            req.body.type === 'join'
                ? `${req.session.color} has entered.`
                : `${req.session.color} has left.`;

        const sysChat = new Chat({
            room: req.params.id,
            user: 'system',
            chat,
        });

        await sysChat.save();

        const io = req.app.get('io');

        io.of('/chat')
            .to(req.params.id)
            .emit('sys', {
                user: 'system',
                chat,
                number: io.of('/chat').adapter.rooms[req.params.id].length,
            });

        res.send('Sys Message Sent');
    } catch (err) {
        console.error(err);
        next(err);
    }
};
