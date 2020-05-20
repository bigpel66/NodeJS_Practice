module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            email: {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
            },
            nickname: { type: DataTypes.STRING(15), allowNull: false },
            password: { type: DataTypes.STRING(100), allowNull: true },
            provider: {
                type: DataTypes.STRING(25),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: { type: DataTypes.STRING(30), allowNull: true },
        },
        {
            timestamps: true,
            paranoid: true,
            underscored: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        }
    );
};
