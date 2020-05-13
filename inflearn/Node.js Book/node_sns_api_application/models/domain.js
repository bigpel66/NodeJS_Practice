module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'domain',
        {
            host: { type: DataTypes.STRING(80), allowNull: false },
            type: { type: DataTypes.STRING(10), allowNull: false },
            clientSecret: { type: DataTypes.STRING(40), allowNull: false },
        },
        {
            timestamps: true,
            paranoid: true,
            underscored: false,
            validate: {
                unknownType() {
                    if (this.type !== 'free' && this.type !== 'preminum') {
                        throw new Error(
                            `Type Column should be 'free' or 'premium'`
                        );
                    }
                },
            },
        }
    );
};
