const { expect } = require('chai');
const sinon = require('sinon');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

const { accountController } = require('../../../src/controllers/accountController');
const { userRepository } = require('../../../src/db/repositories/userRepository');
const appConstants = require('../../../src/constants/app');

describe('Account Controller', () => {
    const password = bcrypt.hashSync('password', appConstants.user.password.rounds);

    afterEach(() => {
        sinon.restore();
    });

    describe('register', () => {
        it('should throw an error if the user with that email already exists', (done) => {
            const req = { body: { email: 'email' } };

            sinon.replace(userRepository, 'findOne', sinon.fake.resolves(true));

            accountController.register(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(422);
                    done();
                });
        });
        
        it('should register the user if the user with that email doesn\'t exist', (done) => {
            const req = { body: { email: 'email' } };

            sinon.replace(userRepository, 'findOne', sinon.fake.resolves(false));
            sinon.replace(userRepository, 'create', sinon.fake.resolves({ id: 1 }));

            accountController.register(req)
                .then((response) => {
                    expect(response.status).to.be.equal(201);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('login', () => {
        it ('should throw an error if the user with that email doesn\'t exist', (done) => {
            const req = { body: { email: 'email' } };

            sinon.replace(userRepository, 'findOne', sinon.fake.resolves(false));

            accountController.login(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(401);
                    done();
                });
        });

        it('should throw an error if the password doesn\'t match the existing password', (done) => {
            const req = { body: { email: 'email', password: 'password1' } };
            sinon.replace(userRepository, 'findOne', sinon.fake.resolves({ password }));

            accountController.login(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(401);
                    done();
                });
        });

        it('should login the user if the password matches the existing password', (done) => {
            const req = { body: { email: 'email', password: 'password' } };
            sinon.replace(userRepository, 'findOne', sinon.fake.resolves({ password }));

            accountController.login(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('updateProfile', () => {
        it('should throw an error if the user doesn\'t exist', (done) => {
            const req = { user: { id: 1 }, body: {} };

            sinon.replace(userRepository, 'update', sinon.fake.resolves(false));

            accountController.updateProfile(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                    done();
                });
        });
        
        it('should update the profile if the user exists', (done) => {
            const req = { user: { id: 1 }, body: {} };

            sinon.replace(userRepository, 'update', sinon.fake.resolves(true));

            accountController.updateProfile(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('updatePassword', () => {
        it('should throw an error if the password doesn\'t match the existing password', (done) => {
            const req = { user: { id: 1 }, body: { currentPassword: 'password1' } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves({ password }));

            accountController.updatePassword(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(422);
                    done();
                });
        });

        it('should update the user password if the password matches the existing password', (done) => {
            const req = { user: { id: 1 }, body: { currentPassword: 'password' } };

            sinon.replace(userRepository, 'findById', sinon.fake.resolves({ password }));
            sinon.replace(userRepository, 'update', sinon.fake.resolves(true));

            accountController.updatePassword(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });
});
