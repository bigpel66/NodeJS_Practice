module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'commnet',
        {
            // OMITTABLE
            // id: {
            //     type: DataTypes.INTEGER,
            //     autoIncrement: true,
            //     allowNull: false,
            //     primaryKey: true,
            // },
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
