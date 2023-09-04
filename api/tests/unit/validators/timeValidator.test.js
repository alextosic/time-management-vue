const { expect } = require('chai');
const sinon = require('sinon');

const { timeValidator } = require('../../../src/validators/timeValidator');
const { timeRepository } = require('../../../src/db/repositories/timeRepository');
const appContants = require('../../../src/constants/app');
const validatorUtil = require('../../utils/unit/validatorUtil');

const { maxPerDay } = appContants.time;

describe('Time Validator', () => {
    const res = {};
    const next = sinon.fake();
    let validations;

    afterEach(() => {
        sinon.restore();
    });

    describe('validateFrom', () => {
        beforeEach(() => {
            validations = timeValidator.validateFrom();
        });

        it('should throw an error if it\'s not a proper ISO date', (done) => {
            const req = { query: { from: 'asd' } };
            const msg = 'From should be a valid date.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it doesn\'t exist', (done) => {
            const req = { query: {} };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });

        it('should pass the validation if it exists and is a proper ISO date', (done) => {
            const req = { query: { from: '2019-03-23' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateTo', () => {
        beforeEach(() => {
            validations = timeValidator.validateTo();
        });

        it('should throw an error if it\'s not a proper ISO date', (done) => {
            const req = { query: { to: 'asd' } };
            const msg = 'To should be a valid date.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it doesn\'t exist', (done) => {
            const req = { query: {} };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });

        it('should pass the validation if it exists and is a proper ISO date', (done) => {
            const req = { query: { to: '2019-03-23' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateDate', () => {
        beforeEach(() => {
            validations = timeValidator.validateDate();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'Date is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it\'s not a proper ISO date', (done) => {
            const req = { body: { date: 'asd' } };
            const msg = 'Date should be a valid date.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it exists and is a proper ISO date', (done) => {
            const req = { body: { date: '2019-03-23' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateDateOptional', () => {
        beforeEach(() => {
            validations = timeValidator.validateDateOptional();
        });

        it('should throw an error if it\'s not a proper ISO date', (done) => {
            const req = { body: { date: 'asd' } };
            const msg = 'Date should be a valid date.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it doesn\'t exist', (done) => {
            const req = { body: {} };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });

        it('should pass the validation if it exists and is a proper ISO date', (done) => {
            const req = { body: { date: '2019-03-23' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateLength', () => {
        beforeEach(() => {
            validations = timeValidator.validateLength();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'Length is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it\'s not a float', (done) => {
            const req = { body: { length: 'a' } };
            const msg = 'Length should be a float.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if the total length of time entries per user will pass the maximum allowed value', (done) => {
            const req = { user: {}, body: { length: 5 } };
            const msg = `Time entries per user cannot total more than ${maxPerDay} hours per day`;

            sinon.replace(timeRepository, 'find', sinon.fake.resolves([{ length: 10 }, { length: 12 }]));

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation otherwise', (done) => {
            const req = { user: {}, body: { length: '5.5' } };

            sinon.replace(timeRepository, 'find', sinon.fake.resolves([{ length: 7 }, { length: 11.5 }]));

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateLengthOptional', () => {
        beforeEach(() => {
            validations = timeValidator.validateLengthOptional();
        });

        it('should throw an error if it\'s not a float', (done) => {
            const req = { body: { length: 'a' } };
            const msg = 'Length should be a float.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if the total length of time entries per user will pass the maximum allowed value', (done) => {
            const req = { user: {}, body: { length: 5 }, params: {} };
            const msg = `Time entries per user cannot total more than ${maxPerDay} hours per day`;

            sinon.replace(timeRepository, 'findById', sinon.fake.resolves({ userId: 1 }));
            sinon.replace(timeRepository, 'find', sinon.fake.resolves([{ length: 10 }, { length: 12 }]));

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it doesn\'t exist', (done) => {
            const req = { body: {} };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });

        it('should pass the validation otherwise', (done) => {
            const req = { user: {}, body: { length: '5.5' }, params: {} };

            sinon.replace(timeRepository, 'findById', sinon.fake.resolves({ userId: 1 }));
            sinon.replace(timeRepository, 'find', sinon.fake.resolves([{ length: 7 }, { length: 11.5 }]));

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateNote', () => {
        beforeEach(() => {
            validations = timeValidator.validateNote();
        });

        it('should throw an error if it\'s not a string', (done) => {
            const req = { body: { note: 4 } };
            const msg = 'Note should be a string.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it doesn\'t exist', (done) => {
            const req = { body: {} };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });

        it('should pass the validation if it exists and is a string', (done) => {
            const req = { body: { note: 'asda' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                }); 
        });
    });

    describe('validateUserId', () => {
        beforeEach(() => {
            validations = timeValidator.validateUserId();
        });

        it('should throw an error if it is not an integer', (done) => {
            const req = { body: { userId: 'asd' } };
            const msg = 'User id should be an integer.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it doesn\'t exist', (done) => {
            const req = { body: {} };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });

        it('should pass the validation otherwise', (done) => {
            const req = { body: { userId: '1' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });
});
