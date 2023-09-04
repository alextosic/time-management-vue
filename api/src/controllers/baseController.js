const { validationResult } = require('express-validator');

const BadRequestResponse = require('../responses/error/badRequestResponse');
const UnprocessableResponse = require('../responses/error/unprocessableResponse');

class BaseController {
    async doAction(action, req, res, next) {
        if (!this[action] || typeof this[action] !== 'function') {
            return next(new BadRequestResponse('Invalid action. Please contact your server administrator.'));
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new UnprocessableResponse(null, errors.array()));
        }

        try {
            const result = await this[action](req, res);

            if (result) {
                return res.status(result.status || 200).json({
                    msg: result.message || 'Action successfully performed.',
                    data: result.data,
                });
            }

            return;
        } catch (err) {
            return next(err);
        }
    }

    getPagination(req) {
        const pagination = {};

        if (req.query.pageSize) {
            pagination.limit = parseInt(req.query.pageSize, 10);

            if (req.query.page) {
                pagination.offset = (parseInt(req.query.page, 10) - 1) * parseInt(req.query.pageSize, 10);
            }
        }

        return pagination;
    }
}

module.exports = BaseController;
