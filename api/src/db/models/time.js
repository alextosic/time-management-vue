const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const timeSchema = {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        length: {
            type: DataTypes.FLOAT(4, 2),
            allowNull: false,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    };
    
    class Time extends Model {}
    
    Time.init(timeSchema, { sequelize, timestamps: true, tableName: 'times' });
    Time.associate = (models) => Time.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

    return Time;
};
