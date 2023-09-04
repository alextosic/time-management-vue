const { validationResult } = require('express-validator');

module.exports = {
    async getValidationErrors(validations, req, res, next) {
        await Promise.all(validations.map(async (validation) => {
            await validation(req, res, next);
        }));

        return validationResult(req).array();
    },
};
