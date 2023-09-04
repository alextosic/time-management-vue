const { query, body } = require('express-validator');

const BaseValidator = require('./baseValidator');
const appConstants = require('../constants/app');
const { timeRepository } = require('../db/repositories/timeRepository');

const { maxPerDay } = appConstants.time;
const { USER } = appConstants.user.roles;

class TimeValidator extends BaseValidator {
    validateFrom() {
        return [
            query('from')
                .optional()
                .isISO8601().withMessage('From should be a valid date.'),
        ];
    }

    validateTo() {
        return [
            query('to')
                .optional()
                .isISO8601().withMessage('To should be a valid date.'),
        ];
    }

    validateDate() {
        return [
            body('date')
                .exists().withMessage('Date is required.')
                .isISO8601().withMessage('Date should be a valid date.'),
        ];
    }

    validateDateOptional() {
        return [
            body('date')
                .optional()
                .isISO8601().withMessage('Date should be a valid date.'),
        ];
    }

    validateLength() {
        return [
            body('length')
                .exists().withMessage('Length is required.')
                .isFloat().withMessage('Length should be a float.')
                .custom(async (value, { req }) => {
                    const userId = req.user.role === USER ? req.user.id : req.body.userId || req.user.id;

                    const existingTimes = await timeRepository.find({
                        where: { date: req.body.date, userId },
                    });
                    
                    const existingTimesLength = existingTimes.reduce((acc, curr) => acc + curr.length, 0);
            
                    if (existingTimesLength + parseFloat(value) > maxPerDay) {
                        const message = `Time entries per user cannot total more than ${maxPerDay} hours per day`;
                        return Promise.reject(message);
                    }

                    return Promise.resolve();
                }),
        ];
    }

    validateLengthOptional() {
        return [
            body('length')
                .optional()
                .isFloat().withMessage('Length should be a float.')
                .custom(async (value, { req }) => {
                    if (!value) {
                        return Promise.resolve();
                    }

                    const time = await timeRepository.findById(req.params.id);
                    const userId = time.userId;

                    const existingTimes = await timeRepository.find({
                        where: { id: { [timeRepository.operations.not]: req.params.id }, date: req.body.date, userId },
                    });
                    
                    const existingTimesLength = existingTimes.reduce((acc, curr) => acc + curr.length, 0);
            
                    if (existingTimesLength + parseFloat(value) > maxPerDay) {
                        const message = `Time entries per user cannot total more than ${maxPerDay} hours per day`;
                        return Promise.reject(message);
                    }

                    return Promise.resolve();
                }),
        ];
    }

    validateNote() {
        return [
            body('note')
                .optional()
                .isString().withMessage('Note should be a string.')
                .trim()
                .escape(),
        ];
    }

    validateUserId() {
        return [
            body('userId')
                .optional()
                .isInt().withMessage('User id should be an integer.'),
        ];
    }

    validateList() {
        return [
            ...this.validatePageSize(),
            ...this.validatePage(),
            ...this.validateFrom(),
            ...this.validateTo(),
        ];
    }

    validateCreate() {
        return [
            ...this.validateDate(),
            ...this.validateLength(),
            ...this.validateNote(),
            ...this.validateUserId(),
        ];
    }

    validateUpdate() {
        return [
            ...this.validateId(),
            ...this.validateDateOptional(),
            ...this.validateLengthOptional(),
            ...this.validateNote(),
            ...this.validateUserId(),
        ];
    }

    validateDelete() {
        return [
            ...this.validateId(),
        ];
    }
}

module.exports = {
    TimeValidator,
    timeValidator: new TimeValidator(),
};
