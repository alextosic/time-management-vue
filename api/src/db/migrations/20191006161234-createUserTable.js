module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('users', {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.DataTypes.ENUM(['0', '1', '2', '3']),
                allowNull: false,
                defaultValue: '3',
            },
            preferredWorkingHours: {
                type: Sequelize.DataTypes.FLOAT(4, 2),
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
            },
        });
    },
    down(queryInterface) {
        return queryInterface.dropTable('users');
    },
};
