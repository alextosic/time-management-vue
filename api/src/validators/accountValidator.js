const { body } = require('express-validator');

const BaseValidator = require('./baseValidator');
const appConstants = require('../constants/app');

class AccountValidator extends BaseValidator {
    validateCurrentPassword() {
        const { minLength } = appConstants.user.password;

        return [
            body('currentPassword')
                .exists().withMessage('Current password is required.')
                .trim()
                .escape()
                .isLength(minLength).withMessage(`Current password should have a minimum of ${minLength} characters.`),
        ];
    }

    validateRegister() {
        return [
            ...this.validateFirstName(),
            ...this.validateLastName(),
            ...this.validateEmail(),
            ...this.validatePassword(),
            ...this.validateConfirmPassword(),
        ];
    }

    validateLogin() {
        return [
            ...this.validateEmail(),
            ...this.validatePassword(),
        ];
    }

    validateUpdateProfile() {
        return [
            ...this.validateFirstNameOptional(),
            ...this.validateLastNameOptional(),
            ...this.validateEmailOptional(),
            ...this.validatePreferredWorkingHours(),
        ];
    }

    validateUpdatePassword() {
        return [
            ...this.validateCurrentPassword(),
            ...this.validatePassword(),
            ...this.validateConfirmPassword(),
        ];
    }
}

module.exports = {
    AccountValidator,
    accountValidator: new AccountValidator(),
};
