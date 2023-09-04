const BaseErrorResponse = require('./baseErrorResponse');

class NotFoundResponse extends BaseErrorResponse {
    constructor(message, data) {
        super(message, 404, data);
    }
}

module.exports = NotFoundResponse;
