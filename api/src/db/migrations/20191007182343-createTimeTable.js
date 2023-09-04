module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('times', {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            date: {
                type: Sequelize.DataTypes.DATEONLY,
                allowNull: false,
            },
            length: {
                type: Sequelize.DataTypes.FLOAT(4, 2),
                allowNull: false,
            },
            note: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            userId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
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
        return queryInterface.dropTable('times');
    },
};
