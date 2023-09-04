const BaseSuccessResponse = require('./baseSuccessResponse');

class OkResponse extends BaseSuccessResponse {
    constructor(message, data) {
        super(message, 200, data);
    }
}

module.exports = OkResponse;
