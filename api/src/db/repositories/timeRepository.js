const BaseRepository = require('./baseRepository');
const { Time } = require('../models');

class TimeRepository extends BaseRepository {
    constructor(timeModel) {
        super(timeModel, ['id', 'date', 'length', 'note', 'userId', 'createdAt', 'updatedAt']);
    }
}

module.exports = {
    TimeRepository,
    timeRepository: new TimeRepository(Time),
};
