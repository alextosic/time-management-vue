const BaseRepository = require('./baseRepository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
    constructor(userModel) {
        super(userModel, [
            'id',
            'firstName',
            'lastName',
            'email',
            'role',
            'preferredWorkingHours',
            'createdAt',
            'updatedAt',
        ]);
    }
}

module.exports = {
    UserRepository,
    userRepository: new UserRepository(User),
};
