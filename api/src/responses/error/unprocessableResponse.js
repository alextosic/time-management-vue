const BaseErrorResponse = require('./baseErrorResponse');

class UnprocessableResponse extends BaseErrorResponse {
    constructor(message, data) {
        super(message, 422, data);
    }
}

module.exports = UnprocessableResponse;
