const cors = require('cors');

const ServerErrorResponse = require('../responses/error/serverErrorResponse');

class CorsMiddleware {
    init() {
        return cors((req, callback) => {
            const { origin } = req.headers;
            const host = `${req.protocol}://${req.get('host')}`;

            if (process.env.NODE_ENV === 'development' || host === origin || !origin) {
                return callback(null, true);
            }

            return callback(new ServerErrorResponse('Access from that origin is not allowed.'));
        });
    }
}

module.exports = new CorsMiddleware();
