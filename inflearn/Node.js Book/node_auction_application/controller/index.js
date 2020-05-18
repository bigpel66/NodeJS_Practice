const schedule = require('node-schedule');
const { Good, User, Auction, sequelize } = require('../models/index');

module.exports.getUser = (req, res, next) => {
    res.locals.user = req.user;
    next();
};

module.exports.getMain = async (req, res, next) => {
    try {
        const goods = await Good.findAll({ where: { bidderId: null } });

        res.render('main', {
            title: 'Node Auction',
            goods,
            loginError: req.flash('loginError'),
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getJoin = (req, res, next) => {
    res.render('join', {
        title: 'Join - Node Auction',
        joinError: req.flash('joinError'),
    });
};

module.exports.getGood = (req, res, next) => {
    res.render('good', {
        title: 'Register Good - Node Auction',
    });
};

module.exports.postGood = async (req, res, next) => {
    try {
        const { name, price } = req.body;
        const good = await Good.create({
            name,
            price,
            imageUrl: req.file.filename,
            ownerId: req.user.id,
        });
        const end = new Date();
        
        end.setDate(end.getDate() + 1);
        schedule.scheduleJob(end, async () => {
            const success = await Auction.findOne({
                where: { goodId: good.id },
                order: [['bid', 'DESC']],
            });

            await Good.update(
                { bidderId: success.userId },
                { where: { id: good.id } }
            );

            await User.update(
                {
                    money: sequelize.literal(`money - ${success.bid}`),
                },
                { where: { id: success.userId } }
            );
        });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getGoodDetail = async (req, res, next) => {
    try {
        const [good, auction] = await Promise.all([
            Good.findOne({
                where: { id: req.params.id },
                include: [{ model: User, as: 'owner' }],
            }),
            Auction.findAll({
                where: { goodId: req.params.id },
                include: [{ model: User }],
                order: [['bid', 'ASC']],
            }),
        ]);

        res.render('auction', {
            title: `${good.name} - Node Auction`,
            good,
            auction,
            auctionError: req.flash('auctionError'),
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.postGoodDetailBid = async (req, res, next) => {
    try {
        const { bid, msg } = req.body;
        const good = await Good.findOne({
            where: { id: req.params.id },
            include: [{ model: Auction }],
            order: [[{ model: Auction }, 'bid', 'DESC']],
        });

        if (bid > req.user.money) {
            return res.status(403).send('You are not afford to bid');
        }

        if (good.price > bid) {
            return res
                .status(403)
                .send('Bid is lower than "Start Price of the Good"');
        }

        if (
            new Date(good.createdAt).valueOf() + 24 * 60 * 60 * 1000 <
            new Date()
        ) {
            return res.status(403).send('Bid is over');
        }

        if (good.auctions[0] && good.auctions[0].bid >= bid) {
            return res.status(403).send('Bid is lower than "Former Bid"');
        }

        const result = await Auction.create({
            bid,
            msg,
            userId: req.user.id,
            goodId: req.params.id,
        });

        const io = req.app.get('io');

        io.to(req.params.id).emit('bid', {
            bid: result.bid,
            msg: result.msg,
            nickname: req.user.nickname,
        });

        return res.send('Made a Bid');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports.getList = async (req, res, next) => {
    try {
        const goods = await Good.findAll({
            where: { bidderId: req.user.id },
            include: [{ model: Auction }],
            order: [[{ model: Auction }, 'bid', 'DESC']],
        });

        res.render('list', { title: 'Succeed Bids - Node Auction', goods });
    } catch (err) {
        console.error(err);
        next(err);
    }
};
