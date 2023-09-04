const { expect } = require('chai');
const sinon = require('sinon');

const { userController } = require('../../../src/controllers/userController');
const { userRepository } = require('../../../src/db/repositories/userRepository');

describe('User Controller', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('details', () => {
        it('should throw an error if the user is not found', (done) => {
            const req = { params: {} };
            sinon.replace(userRepository, 'findById', sinon.fake.resolves(false));

            userController.details(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                    done();
                });
        });

        it('should fetch the user details if it is found', (done) => {
            const req = { params: {} };
            sinon.replace(userRepository, 'findById', sinon.fake.resolves(true));

            userController.details(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('create', () => {
        it('should throw an error if the user with provided email already exists', (done) => {
            const req = { body: {} };
            sinon.replace(userRepository, 'findOne', sinon.fake.resolves(true));

            userController.create(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(422);
                    done();
                });
        });

        it('should create a new user if the email is unique', (done) => {
            const req = { body: {} };

            sinon.replace(userRepository, 'findOne', sinon.fake.resolves(false));
            sinon.replace(userRepository, 'create', sinon.fake.resolves({ id: 1 }));
            sinon.replace(userRepository, 'findById', sinon.fake.resolves(true));

            userController.create(req)
                .then((response) => {
                    expect(response.status).to.be.equal(201);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('update', () => {
        it('should throw an error if the user is not found', (done) => {
            const req = { params: {}, body: {} };
            sinon.replace(userRepository, 'update', sinon.fake.resolves(false));

            userController.update(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                    done();
                });
        });

        it('should update the user if it is found', (done) => {
            const req = { params: {}, body: {} };
            sinon.replace(userRepository, 'update', sinon.fake.resolves(true));

            userController.update(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('delete', () => {
        it('should throw an error if the user is not found', (done) => {
            const req = { params: {} };
            sinon.replace(userRepository, 'delete', sinon.fake.resolves(false));

            userController.delete(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                    done();
                });
        });

        it('should delete the user if it is found', (done) => {
            const req = { params: {} };
            sinon.replace(userRepository, 'delete', sinon.fake.resolves(true));

            userController.delete(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });
});
