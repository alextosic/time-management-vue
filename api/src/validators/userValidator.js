const { body } = require('express-validator');

const BaseValidator = require('./baseValidator');
const appConstants = require('../constants/app');

const { minLength } = appConstants.user.password;
const { roles } = appConstants.user;

class UserValidator extends BaseValidator {
    validatePasswordOptional() {
        return [
            body('password')
                .optional()
                .trim()
                .escape()
                .isLength(minLength).withMessage(`Password should have a minimum of ${minLength} characters.`),
        ];
    }

    validateConfirmPasswordOptional() {
        return [
            body('confirmPassword')
                .custom((value, { req }) => {
                    if (value && (!req.body.password || value !== req.body.password)) {
                        return Promise.reject('Confirm password should match the password.');
                    }

                    return Promise.resolve();
                }),
        ];
    }

    validateCurrentPasswordOptional() {
        const { minLength } = appConstants.user.password;

        return [
            body('currentPassword')
                .optional()
                .trim()
                .escape()
                .isLength(minLength).withMessage('Current password should have a minimum of 6 characters.'),
        ];
    }

    validateRole() {
        return [
            body('role')
                .exists().withMessage('Role is required.')
                .custom((value) => {
                    const validRoles = Object.values(roles).filter(role => role !== roles.SUPERADMIN);
                    const isValidValue = validRoles.indexOf(value) >= 0;

                    if (isValidValue) {
                        return Promise.resolve();
                    }

                    return Promise.reject('Role should have a valid value.');
                }),
        ];
    }

    validateRoleOptional() {
        return [
            body('role')
                .optional()
                .custom((value) => {
                    const roles = Object.values(appConstants.user.roles)
                        .filter(role => role !== appConstants.user.roles.SUPERADMIN);
                        
                    const isValidValue = roles.indexOf(value) >= 0;

                    if (isValidValue) {
                        return Promise.resolve();
                    }

                    return Promise.reject(`Role should have a valid value.`);
                }),
        ];
    }

    validateList() {
        return [
            ...this.validatePageSize(),
            ...this.validatePage(),
        ];
    }

    validateCreate() {
        return [
            ...this.validateFirstName(),
            ...this.validateLastName(),
            ...this.validateEmail(),
            ...this.validatePassword(),
            ...this.validateConfirmPassword(),
            ...this.validatePreferredWorkingHours(),
            ...this.validateRole(),
        ];
    }

    validateUpdate() {
        return [
            ...this.validateFirstNameOptional(),
            ...this.validateLastNameOptional(),
            ...this.validateEmailOptional(),
            ...this.validatePreferredWorkingHours(),
            ...this.validateRoleOptional(),
        ];
    }

    validateUpdatePassword() {
        return [
            ...this.validateCurrentPasswordOptional(),
            ...this.validatePassword(),
            ...this.validateConfirmPassword(),
        ];
    }

    validateDelete() {
        return [
            ...this.validateId(),
        ];
    }
}

module.exports = {
    UserValidator,
    userValidator: new UserValidator(),
};
