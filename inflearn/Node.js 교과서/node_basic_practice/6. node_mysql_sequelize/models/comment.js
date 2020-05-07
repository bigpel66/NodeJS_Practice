module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'commnet',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            commenter: {},
            comment: { type: DataTypes.STRING(100), allowNull: false },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('now()'),
            },
        },
        {
            timestamps: false,
            underscored: false,
        }
    );
};
