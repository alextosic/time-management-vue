const BaseErrorResponse = require('./baseErrorResponse');

class ForbiddenResponse extends BaseErrorResponse {
    constructor(message) {
        super(message, 403);
    }
}

module.exports = ForbiddenResponse;
