const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');

const appConstants = require('../../constants/app');

module.exports = (sequelize) => {
    const userSchema = {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(Object.values(appConstants.user.roles)),
            allowNull: false,
            defaultValue: appConstants.user.roles.USER,
        },
        preferredWorkingHours: {
            type: DataTypes.FLOAT(4, 2),
            allowNull: true,
        },
    };

    const hashPassword = (user) => {
        if (user.password) {
            console.log(user.password);
            user.password = bcrypt.hashSync(user.password, appConstants.user.password.rounds);
        }
    };
    
    class User extends Model {}
    
    User.init(userSchema, { sequelize, timestamps: true, tableName: 'users' });
    User.associate = (models) => User.hasMany(models.Time, { as: 'times', foreignKey: 'userId' });

    User.beforeCreate(hashPassword);
    User.beforeUpdate(hashPassword);

    return User;
};
