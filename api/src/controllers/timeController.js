const BaseController = require('./baseController');

const CreatedResponse = require('../responses/success/createdResponse');
const OkResponse = require('../responses/success/okResponse');
const NotFoundResponse = require('../responses/error/notFoundResponse');

const { timeRepository } = require('../db/repositories/timeRepository');
const { userRepository } = require('../db/repositories/userRepository');
const appConstants = require('../constants/app');

const TimePdfService = require('../services/timePdfService');

class TimeController extends BaseController {
    getDateFilters(req) {
        return {
            [timeRepository.operations.and]: [
                { [timeRepository.operations.gte]: req.query.from || appConstants.time.date.min },
                { [timeRepository.operations.lte]: req.query.to || appConstants.time.date.max },
            ],
        };
    }

    async list(req) {
        const list = await timeRepository.find({
            where: {
                date: this.getDateFilters(req),
                [timeRepository.operations.or]: [
                    { userId: req.user.id },
                    { '$user.role$': { [timeRepository.operations.gt]: req.user.role } },
                ],
            },
            include: [{ model: userRepository.model, as: 'user', attributes: userRepository.attributes }],
        });

        return new OkResponse('Time list fetched.', list);
    }

    async export(req) {
        const list = await timeRepository.find({
            where: {
                date: this.getDateFilters(req),
                [timeRepository.operations.or]: [
                    { userId: req.user.id },
                    { '$user.role$': { [timeRepository.operations.gt]: req.user.role } },
                ],
            },
            include: ['user'],
            order: [['date'], ['user', 'email']],
        });

        const pdfService = new TimePdfService();
        const file = await pdfService.createFile(list);

        return new CreatedResponse('Time list PDF generated.', file);
    }

    async listPerUser(req) {
        const list = await timeRepository.find({
            where: {
                userId: req.user.id,
                date: this.getDateFilters(req),
            },
            include: [{ model: userRepository.model, as: 'user', attributes: userRepository.attributes }],
        });

        return new OkResponse('Time list fetched.', list);
    }

    async exportPerUser(req) {
        const list = await timeRepository.find({
            where: {
                userId: req.user.id,
                date: this.getDateFilters(req),
            },
            include: ['user'],
            order: [['date'], ['user', 'email']],
        });

        const pdfService = new TimePdfService();
        const file = await pdfService.createFile(list);

        return new CreatedResponse('Time list PDF generated.', file);
    }

    async details(req) {
        const time = await timeRepository.findById(req.params.id);
        
        if (!time) {
            throw new NotFoundResponse('Time entry not found.');
        }

        return new OkResponse('Time entry found.', time);
    }

    async create(req) {
        const fields = ['date', 'length', 'note', 'userId'];
        const userId = req.user.role === appConstants.user.roles.USER ? req.user.id : req.body.userId || req.user.id;
        const data = { ...req.body, userId };

        const createdTime = await timeRepository.create(data, { fields });
        return new CreatedResponse('Time entry created.', await timeRepository.findById(createdTime.id));
    }

    async update(req) {
        const fields = ['date', 'length', 'note', 'userId'];
        const userId = req.user.role === appConstants.user.roles.USER ? req.user.id : req.body.userId || req.user.id;
        const data = { ...req.body, userId };

        const updatedTime = await timeRepository.update(req.params.id, data, { fields });

        if (!updatedTime) {
            throw new NotFoundResponse('Time entry not found.');
        }

        return new OkResponse('Time entry updated.', updatedTime);
    }

    async delete(req) {
        const deletedTimeId = await timeRepository.delete(req.params.id);

        if (!deletedTimeId) {
            throw new NotFoundResponse('Time entry not found.');
        }

        return new OkResponse('Time entry deleted.', { id: deletedTimeId });
    }
}

module.exports = {
    TimeController,
    timeController: new TimeController(),
};
