const jwt = require('jsonwebtoken');

const { userRepository } = require('../db/repositories/userRepository');
const { timeRepository } = require('../db/repositories/timeRepository');
const appConstants = require('../constants/app');

const UnauthorizedResponse = require('../responses/error/unauthorizedResponse');
const ForbiddenResponse = require('../responses/error/forbiddenResponse');

class AuthMiddleware {
    authenticate() {
        return async (req, res, next) => {
            if (!req.headers || !req.headers.authorization || req.headers.authorization.indexOf('Bearer ') !== 0) {
                return next(new UnauthorizedResponse('Unauthorized.'));
            }

            const token = req.headers.authorization.split(' ')[1];
            let decodedToken;

            try {
                decodedToken = jwt.verify(token, appConstants.jwt.secret);
            } catch (err) {
                return next(new UnauthorizedResponse('Token invalid or expired.'));
            }

            if (!decodedToken.id) {
                return next(new UnauthorizedResponse('Unauthorized.'));
            }

            const user = await userRepository.findById(decodedToken.id);

            if (!user) {
                return next(new UnauthorizedResponse('Unauthorized.'));
            }

            req.user = user;
            return next();
        };
    }

    authorize(allowedRoles) {
        return async (req, res, next) => {
            if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.indexOf(req.user.role) < 0) {
                return next(new ForbiddenResponse('You are not allowed to access this resource.'));
            }

            return next();
        };
    }

    authorizeUserAccess() {
        return async (req, res, next) => {
            if (req.params.id) {
                const foundUser = await userRepository.findById(req.params.id);

                if (foundUser && req.user.role >= foundUser.role) {
                    return next(new ForbiddenResponse('You are not allowed to access this resource.'));
                }
            }

            if (req.body.role && req.user.role >= req.body.role) {
                return next(new ForbiddenResponse('You are not allowed to add that data.'));
            }

            return next();
        };
    }

    authorizeTimeAccess() {
        return async (req, res, next) => {
            if (req.params.id) {
                const foundTime = await timeRepository.findById(req.params.id, { include: ['user'] });

                if (foundTime && req.user.role >= foundTime.user.role && req.user.id !== foundTime.userId) {
                    return next(new ForbiddenResponse('You are not allowed to access this resource.'));
                }
            }

            if (req.body.userId) {
                const foundUser = await userRepository.findById(req.body.userId);

                if (!foundUser || (req.user.role >= foundUser.role && req.user.id !== foundUser.id)) {
                    return next(new ForbiddenResponse('You are not allowed to add that data.'));
                }
            }

            return next();
        };
    }
}

module.exports = new AuthMiddleware();
