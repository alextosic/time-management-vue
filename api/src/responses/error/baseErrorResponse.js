class BaseErrorResponse extends Error {
    constructor(message, status, data) {
        super(message);

        this.status = status;
        this.data = data;
    }
}

module.exports = BaseErrorResponse;
