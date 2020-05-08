module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            // OMITTABLE
            // id: {
            //     type: DataTypes.INTEGER,
            //     autoIncrement: true,
            //     unique: true,
            //     primaryKey: true,
            // },
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            age: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            commnet: { type: DataTypes.TEXT, allowNull: true },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('now()'),
            },
        },
        {
            timestamps: true,
            underscored: false,
        }
    );
};
