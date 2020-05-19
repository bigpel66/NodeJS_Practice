const schedule = require('node-schedule');
const { Good, Auction, User, sequelize } = require('./models/index');

module.exports = async () => {
    try {
        const targets = await Good.findAll({
            where: {
                bidderId: null,
            },
        });

        targets.forEach(async (target) => {
            const end = new Date(target.createdAt);
            end.setHours(end.getHours() + target.end);

            if (new Date() > end) {
                const success = await Auction.findOne({
                    where: { goodId: target.id },
                    order: [['bid', 'DESC']],
                });

                await Good.update(
                    { bidderId: success.userId },
                    { where: { id: target.id } }
                );
                await User.update(
                    {
                        money: sequelize.literal(`money - ${success.bid}`),
                    },
                    {
                        where: { id: success.userId },
                    }
                );
            } else {
                schedule.scheduleJob(end, async () => {
                    const success = await Auction.findOne({
                        where: { goodId: target.id },
                        order: [['bid', 'DESC']],
                    });

                    await Good.update(
                        { bidderId: success.userId },
                        { where: { id: target.id } }
                    );
                    await User.update(
                        {
                            money: sequelize.literal(`money - ${success.bid}`),
                        },
                        { where: { id: success.userId } }
                    );
                });
            }
        });
    } catch (err) {
        console.error(err);
    }
};
