const { expect } = require('chai');
const sinon = require('sinon');

const BaseValidator = require('../../../src/validators/baseValidator');
const appContants = require('../../../src/constants/app');
const validatorUtil = require('../../utils/unit/validatorUtil');

const { minLength } = appContants.user.password;
const { maxPerDay } = appContants.time;

describe('Base Validator', () => {
    const res = {};
    const next = sinon.fake();
    const baseValidator = new BaseValidator();
    let validations;

    afterEach(() => {
        sinon.restore();
    });

    describe('validateId', () => {
        beforeEach(() => {
            validations = baseValidator.validateId();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { params: {} };
            const msg = 'Id is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it is not an integer', (done) => {
            const req = { params: { id: 'asd' } };
            const msg = 'Id should be an integer.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation otherwise', (done) => {
            const req = { params: { id: '1' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });
    
    describe('validatePageSize', () => {
        beforeEach(() => {
            validations = baseValidator.validatePageSize();
        });

        it('should throw an error if it is not an integer', (done) => {
            const req = { query: { pageSize: 1.5 } };
            const msg = 'Page size should be an integer.';

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

        it('should pass the validation if it exists and is a number', (done) => {
            const req = { query: { pageSize: '1' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validatePage', () => {
        beforeEach(() => {
            validations = baseValidator.validatePage();
        });

        it('should throw an error if it\'s not an integer', (done) => {
            const req = { query: { page: 'a' } };
            const msg = 'Page should be an integer.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it is an integer, but pageSize doesn\'t exist', (done) => {
            const req = { query: { page: 1 } };
            const msg = 'Page cannot be passed without the page size.';

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

        it('should pass the validation otherwise', (done) => {
            const req = { query: { page: 1, pageSize: 1 } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateFirstName', () => {
        beforeEach(() => {
            validations = baseValidator.validateFirstName();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'First name is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it contains characters that are not letters', (done) => {
            const req = { body: { firstName: 'asda-=+' } };
            const msg = 'First name can only contain letters from the alphabet.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation otherwise', (done) => {
            const req = { body: { firstName: 'asda' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                }); 
        });
    });

    describe('validateFirstNameOptional', () => {
        beforeEach(() => {
            validations = baseValidator.validateFirstNameOptional();
        });

        it('should throw an error if it contains characters that are not letters', (done) => {
            const req = { body: { firstName: 'asda-=+' } };
            const msg = 'First name can only contain letters from the alphabet.';

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

        it('should pass the validation if it exists and only contains letters', (done) => {
            const req = { body: { firstName: 'asda' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                }); 
        });
    });

    describe('validateLastName', () => {
        beforeEach(() => {
            validations = baseValidator.validateLastName();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'Last name is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it contains characters that are not letters', (done) => {
            const req = { body: { lastName: 'asda-=+' } };
            const msg = 'Last name can only contain letters from the alphabet.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation otherwise', (done) => {
            const req = { body: { lastName: 'asda' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                }); 
        });
    });

    describe('validateLastNameOptional', () => {
        beforeEach(() => {
            validations = baseValidator.validateLastNameOptional();
        });

        it('should throw an error if it contains characters that are not letters', (done) => {
            const req = { body: { lastName: 'asda-=+' } };
            const msg = 'Last name can only contain letters from the alphabet.';

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

        it('should pass the validation if it exists and only contains letters', (done) => {
            const req = { body: { lastName: 'asda' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                }); 
        });
    });

    describe('validateEmail', () => {
        beforeEach(() => {
            validations = baseValidator.validateEmail();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'Email is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it is not a proper email address', (done) => {
            const req = { body: { email: 'asdasd' } };
            const msg = 'Email should be a valid email address.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation if it exists and is a proper email address', (done) => {
            const req = { body: { email: 'asd@asd.com' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                }); 
        });
    });

    describe('validateEmailOptional', () => {
        beforeEach(() => {
            validations = baseValidator.validateEmailOptional();
        });

        it('should throw an error if it is not a proper email address', (done) => {
            const req = { body: { email: 'asdasd' } };
            const msg = 'Email should be a valid email address.';

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

        it('should pass the validation if it exists and is a proper email address', (done) => {
            const req = { body: { email: 'asd@asd.com' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                }); 
        });
    });

    describe('validatePassword', () => {
        beforeEach(() => {
            validations = baseValidator.validatePassword();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'Password is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
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

        it('should pass the validation otherwise', (done) => {
            const req = { body: { password: 'password' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });

    describe('validateConfirmPassword', () => {
        beforeEach(() => {
            validations = baseValidator.validateConfirmPassword();
        });

        it('should throw an error if it doesn\'t exist', (done) => {
            const req = { body: {} };
            const msg = 'Confirm password is required.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it exists and is not equal to the password', (done) => {
            const req = { body: { password: 'password', confirmPassword: 'password1' } };
            const msg = 'Confirm password should match the password.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should pass the validation otherwise', (done) => {
            const req = { body: { password: 'password', confirmPassword: 'password' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });
    
    describe('validatePreferredWorkingHours', () => {
        beforeEach(() => {
            validations = baseValidator.validatePreferredWorkingHours();
        });

        it('should throw an error if it is not a float', (done) => {
            const req = { body: { preferredWorkingHours: 'asd' } };
            const msg = 'Preferred working hours should be a float.';

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result[0].msg).to.be.equal(msg);
                    done();
                });
        });

        it('should throw an error if it\'s higher than the maximum value allowed', (done) => {
            const req = { body: { preferredWorkingHours: '24.5' } };
            const msg = `Preferred working hours cannot have a value of more than ${maxPerDay}`;

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

        it('should pass the validation if it exists and is lower or equal than the maximum value allowed', (done) => {
            const req = { body: { preferredWorkingHours: '24' } };

            validatorUtil.getValidationErrors(validations, req, res, next)
                .then((result) => {
                    expect(result).to.have.length(0);
                    done();
                });
        });
    });
});