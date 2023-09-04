const BaseErrorResponse = require('./baseErrorResponse');

class BadRequestResponse extends BaseErrorResponse {
    constructor(data) {
        super(data, 400);
    }
}

module.exports = BadRequestResponse;
