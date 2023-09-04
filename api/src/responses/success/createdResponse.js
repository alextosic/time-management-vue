const BaseSuccessResponse = require('./baseSuccessResponse');

class CreatedResponse extends BaseSuccessResponse {
    constructor(message, data) {
        super(message, 201, data);
    }
}

module.exports = CreatedResponse;
