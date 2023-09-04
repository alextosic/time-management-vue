const { expect } = require('chai');
const sinon = require('sinon');

const { userValidator } = require('../../../src/validators/userValidator');
const appContants = require('../../../src/constants/app');
const validatorUtil = require('../../utils/unit/validatorUtil');

const { minLength } = appContants.user.password;
const { maxPerDay } = appContants.time;

describe('User Validator', () => {
    const res = {};
    const next = sinon.fake();
    let validations;

    afterEach(() => {
        sinon.restore();
    });

    describe('validatePasswordOptional', () => {
        beforeEach(() => {
            validations = userValidator.validatePasswordOptional();
        });

        it('should throw an error if it doesn\'t have minimum length', (done) => {
            const req = { body: { password: '12345' } };
            const msg = `Password should have a minimum of ${minLength} characters.`;

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
            const req = { body: { password: 'password' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateConfirmPasswordOptional', () => {
        beforeEach(() => {
            validations = userValidator.validateConfirmPasswordOptional();
        });

        it('should throw an error if it exists and is not equal to the password', (done) => {
            const req = { body: { confirmPassword: 'password1' } };
            const msg = 'Confirm password should match the password.';

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

        it('should pass the validation if it exists and matches the password', (done) => {
            const req = { body: { password: 'password', confirmPassword: 'password' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateCurrentPasswordOptional', () => {
        beforeEach(() => {
            validations = userValidator.validateCurrentPasswordOptional();
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

        it('should pass the validation if it doesn\'t exist', (done) => {
            const req = { body: {} };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
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

    describe('validateRole', () => {
        beforeEach(() => {
            validations = userValidator.validateRole();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'Role is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it\'s not a valid value', (done) => {
            const req = { body: { role: '5' } };
            const msg = 'Role should have a valid value.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it has a valid value', (done) => {
            const req = { body: { role: '1' } };
            const msg = 'Role should have a valid value.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateRoleOptional', () => {
        beforeEach(() => {
            validations = userValidator.validateRoleOptional();
        });

        it('should throw an error if it\'s not a valid value', (done) => {
            const req = { body: { role: '5' } };
            const msg = 'Role should have a valid value.';

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

        it('should pass the validation if it has a valid value', (done) => {
            const req = { body: { role: '1' } };
            const msg = 'Role should have a valid value.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });
});
