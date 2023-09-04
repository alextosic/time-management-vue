const { param, query, body } = require('express-validator');

const appConstants = require('../constants/app');

const { maxPerDay } = appConstants.time; 

class BaseValidator {
    validateId() {
        return [
            param('id')
                .exists().withMessage('Id is required.')
                .isInt().withMessage('Id should be an integer.'),
        ];
    }

    validatePageSize() {
        return [
            query('pageSize')
                .optional()
                .isInt().withMessage('Page size should be an integer.'),
        ];
    }

    validatePage() {
        return [
            query('page')
                .optional()
                .isInt().withMessage('Page should be an integer.')
                .custom((value, { req }) => {
                    if (value && !req.query.pageSize) {
                        return Promise.reject('Page cannot be passed without the page size.');
                    }

                    return Promise.resolve();
                }),
        ];
    }

    validateFirstName() {
        return [
            body('firstName')
                .exists().withMessage('First name is required.')
                .isAlpha().withMessage('First name can only contain letters from the alphabet.')
                .trim()
                .escape(),
        ];
    }

    validateFirstNameOptional() {
        return [
            body('firstName')
                .optional()
                .isAlpha().withMessage('First name can only contain letters from the alphabet.')
                .trim()
                .escape(),
        ];
    }

    validateLastName() {
        return [
            body('lastName')
                .exists().withMessage('Last name is required.')
                .isAlpha().withMessage('Last name can only contain letters from the alphabet.')
                .trim()
                .escape(),
        ];
    }

    validateLastNameOptional() {
        return [
            body('lastName')
                .optional()
                .isAlpha().withMessage('Last name can only contain letters from the alphabet.')
                .trim()
                .escape(),
        ];
    }

    validateEmail() {
        return [
            body('email')
                .exists().withMessage('Email is required.')
                .isEmail().withMessage('Email should be a valid email address.'),
        ];
    }

    validateEmailOptional() {
        return [
            body('email')
                .optional()
                .isEmail().withMessage('Email should be a valid email address.'),
        ];
    }

    validatePassword() {
        const { minLength } = appConstants.user.password;

        return [
            body('password')
                .exists().withMessage('Password is required.')
                .trim()
                .escape()
                .isLength(minLength).withMessage(`Password should have a minimum of ${minLength} characters.`),
        ];
    }

    validateConfirmPassword() {
        return [
            body('confirmPassword')
                .exists().withMessage('Confirm password is required.')
                .trim()
                .escape()
                .custom((value, { req }) => {
                    if (value && req.body.password && value === req.body.password) {
                        return Promise.resolve();
                    }

                    return Promise.reject('Confirm password should match the password.');
                }),
        ];
    }

    validatePreferredWorkingHours() {
        return [
            body('preferredWorkingHours')
                .optional()
                .isFloat().withMessage('Preferred working hours should be a float.')
                .custom((value) => {
                    if (value && parseFloat(value) > maxPerDay) {
                        return Promise.reject(`Preferred working hours cannot have a value of more than ${maxPerDay}`);
                    }

                    return Promise.resolve();
                }),
        ];
    }
}

module.exports = BaseValidator;
