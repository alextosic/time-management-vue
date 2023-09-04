const BaseErrorResponse = require('./baseErrorResponse');

class UnauthorizedResponse extends BaseErrorResponse {
    constructor(message, data) {
        super(message, 401, data);
    }
}

module.exports = UnauthorizedResponse;
