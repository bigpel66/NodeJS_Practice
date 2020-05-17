module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            email: {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
            },
            nickname: {
                type: DataTypes.STRING(15),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            money: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            timestamps: true,
            paranoid: true,
            underscored: false,
        }
    );
};