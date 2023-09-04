class BaseSuccessResponse {
    constructor(message, status, data) {
        this.message = message;
        this.status = status;
        this.data = data;
    }
}

module.exports = BaseSuccessResponse;
