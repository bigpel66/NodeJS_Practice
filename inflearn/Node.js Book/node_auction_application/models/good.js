module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'good',
        {
            name: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            end: {
                type: DataTypes.INTEGER,
                allowNull: true,
                default: 24,
            },
            price: {
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
