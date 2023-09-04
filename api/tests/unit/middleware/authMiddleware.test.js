const { expect } = require('chai');
const sinon = require('sinon');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const authMiddleware = require('../../../src/middleware/authMiddleware');
const { userRepository } = require('../../../src/db/repositories/userRepository');
const { timeRepository } = require('../../../src/db/repositories/timeRepository');
const appContants = require('../../../src/constants/app');

const { SUPERADMIN, ADMIN, USER_MANAGER, USER } = appContants.user.roles;

describe('Auth Middleware', () => {
    const res = {};

    afterEach(() => {
        sinon.restore();
    });

    describe('authenticate', () => {
        it('should fail if the authorization header doesn\'t exist', (done) => {
            const req = { headers: {} };

            authMiddleware.authenticate()(req, res, (result) => {
                expect(result.status).to.be.equal(401);
                done();
            });
        });

        it('should fail if the authorization header is not in the proper format', (done) => {
            const req = { headers: { authorization: 'Random string' } };

            authMiddleware.authenticate()(req, res, (result) => {
                expect(result.status).to.be.equal(401);
                done();
            });
        });

        it('should fail if the authorization token is not in the proper format', (done) => {
            const req = { headers: { authorization: 'Bearer something' } };

            authMiddleware.authenticate()(req, res, (result) => {
                expect(result.status).to.be.equal(401);
                expect(result.message).to.be.equal('Token invalid or expired.');
                done();
            });
        });

        it('should fail if there is no id in the decoded authorization token', (done) => {
            const token = jwt.sign({ something: 'other' }, appContants.jwt.secret);
            const req = { headers: { authorization: `Bearer ${token}` } };

            authMiddleware.authenticate()(req, res, (result) => {
                expect(result.status).to.be.equal(401);
                done();
            });
        });

        it('should fail if the user cannot be found from the decoded token id', (done) => {
            const token = jwt.sign({ id: 5 }, appContants.jwt.secret);
            const req = { headers: { authorization: `Bearer ${token}` } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves(null));

            authMiddleware.authenticate()(req, res, (result) => {
                expect(result.status).to.be.equal(401);
                done();
            });
        });

        it('should pass the validation if the user can be found from the decoded token id', (done) => {
            const token = jwt.sign({ id: 1 }, appContants.jwt.secret);
            const req = { headers: { authorization: `Bearer ${token}` } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves({ id: 1 }));

            authMiddleware.authenticate()(req, res, (result) => {
                expect(result).to.be.undefined;
                done();
            });
        });
    });

    describe('authorize', () => {
        it('should fail if user\'s role is not in the list of allowed roles', (done) => {
            const req = { user: { role: USER } };
            const allowedRoles = [SUPERADMIN, ADMIN];

            authMiddleware.authorize(allowedRoles)(req, res, (result) => {
                expect(result.status).to.be.equal(403);
                done();
            });
        });

        it('should pass if there is no allowed roles', (done) => {
            const req = { user: { role: USER } };

            authMiddleware.authorize()(req, res, (result) => {
                expect(result).to.be.undefined;
                done();
            });
        });

        it('should pass the validation if user\'s role is in the list of allowed roles', (done) => {
            const req = { user: { role: ADMIN } };
            const allowedRoles = [SUPERADMIN, ADMIN];

            authMiddleware.authorize(allowedRoles)(req, res, (result) => {
                expect(result).to.be.undefined;
                done();
            });
        });
    });

    describe('authorizeUserAccess', () => {
        it('should fail if the user data you want to access is of an equal or higher role than yours', (done) => {
            const req = { params: { id: 5 }, user: { role: USER_MANAGER } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves({ role: USER_MANAGER }));

            authMiddleware.authorizeUserAccess()(req, res, (result) => {
                expect(result.status).to.be.equal(403);
                done();
            });
        });

        it('should fail if you are trying to create a user with an equal or greater role than yours', (done) => {
            const req = { params: {}, body: { role: USER_MANAGER }, user: { role: USER_MANAGER } };

            authMiddleware.authorizeUserAccess()(req, res, (result) => {
                expect(result.status).to.be.equal(403);
                done();
            });
        });

        it('should pass the validation if the user data you want to access is of a lower role than yours', (done) => {
            const req = { params: { id: 5 }, body: {}, user: { role: USER_MANAGER } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves({ role: USER }));

            authMiddleware.authorizeUserAccess()(req, res, (result) => {
                expect(result).to.be.undefined;
                done();
            });
        });
    });

    describe('authorizeTimeAccess', () => {
        it('should fail if the time data you want to access is assigned to a user of an equal or higher role than yours', (done) => {
            const req = { params: { id: 5 }, user: { id: 1, role: USER_MANAGER } };

            sinon.replace(timeRepository, 'findById', sinon.fake.resolves({ user: { role: USER_MANAGER }, userId: 2 }));

            authMiddleware.authorizeTimeAccess()(req, res, (result) => {
                expect(result.status).to.be.equal(403);
                done();
            });
        });

        it('should fail if you are trying to assign a time to a user with an equal or greater role than yours', (done) => {
            const req = { params: {}, body: { userId: 1 }, user: { id: 1, role: USER_MANAGER } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves({ id: 2, role: USER_MANAGER }));

            authMiddleware.authorizeTimeAccess()(req, res, (result) => {
                expect(result.status).to.be.equal(403);
                done();
            });
        });

        it('should pass the validation if the time data you want to access is assigned to a user of a lower role than yours', (done) => {
            const req = { params: { id: 5 }, body: {}, user: { role: USER_MANAGER } };

            sinon.replace(timeRepository, 'findById', sinon.fake.resolves({ user: { role: USER } }));

            authMiddleware.authorizeTimeAccess()(req, res, (result) => {
                expect(result).to.be.undefined;
                done();
            });
        });

        it('should pass the validation if you are trying to assign a time to a user with a lower role than yours', (done) => {
            const req = { params: {}, body: { userId: 5 }, user: { role: USER_MANAGER } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves({ role: USER }));

            authMiddleware.authorizeTimeAccess()(req, res, (result) => {
                expect(result).to.be.undefined;
                done();
            });
        });

        it('should pass the validation if you are trying to access time data assigned to you', (done) => {
            const req = { params: { id: 5 }, body: {}, user: { id: 1, role: USER_MANAGER } };

            sinon.replace(timeRepository, 'findById', sinon.fake.resolves({ user: { role: USER_MANAGER }, userId: 1 }));

            authMiddleware.authorizeTimeAccess()(req, res, (result) => {
                expect(result).to.be.undefined;
                done();
            });
        });

        it('should pass the validation if you are trying to assign a time entry to yourself', (done) => {
            const req = { params: {}, body: { userId: 5 }, user: { id: 1, role: USER_MANAGER } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves({ id: 1, role: USER_MANAGER }));

            authMiddleware.authorizeTimeAccess()(req, res, (result) => {
                expect(result).to.be.undefined;
                done();
            });
        });
    });
});
