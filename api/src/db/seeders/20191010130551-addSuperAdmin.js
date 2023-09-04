const bcrypt = require('bcrypt');

const appConstants = require('../../constants/app');

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('users', [{
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@toptal.com',
            password: bcrypt.hashSync('toptalsuperadmin', appConstants.user.password.rounds),
            role: '0',
            createdAt: new Date(),
            updatedAt: new Date(),
        }]);
    },
};
