const { expect } = require('chai');
const sinon = require('sinon');

const { accountValidator } = require('../../../src/validators/accountValidator');
const appContants = require('../../../src/constants/app');
const validatorUtil = require('../../utils/unit/validatorUtil');

const { minLength } = appContants.user.password;

describe('Account Validator', () => {
    const res = {};
    const next = sinon.fake();
    let validations;

    afterEach(() => {
        sinon.restore();
    });

    describe('validateCurrentPassword', () => {
        beforeEach(() => {
            validations = accountValidator.validateCurrentPassword();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'Current password is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it doesn\'t have minimum length', (done) => {
            const req = { body: { currentPassword: '12345' } };
            const msg = `Current password should have a minimum of ${minLength} characters.`;

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation otherwise', (done) => {
            const req = { body: { currentPassword: 'password' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });
});