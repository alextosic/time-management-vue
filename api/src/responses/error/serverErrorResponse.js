const BaseErrorResponse = require('./baseErrorResponse');

class ServerErrorResponse extends BaseErrorResponse {
    constructor(message, data) {
        super(message, 500, data);
    }
}

module.exports = ServerErrorResponse;
