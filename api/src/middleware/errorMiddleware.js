class ErrorMiddleware {
    handleErrors() {
        return (err, req, res, next) => {
            if (err) {
                const errData = err.data ? err.data.map(error => Object.assign({}, error, { value: undefined })) : null;
                const errors = errData || [{ msg: err.message }];

                return res.status(err.status || 500).json({ errors });
            }

            return next();
        };
    }
}

module.exports = new ErrorMiddleware();
