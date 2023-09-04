const { expect } = require('chai');
const sinon = require('sinon');

const { timeController } = require('../../../src/controllers/timeController');
const { timeRepository } = require('../../../src/db/repositories/timeRepository');

describe('Time Controller', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('details', () => {
        it('should throw an error if the time entry is not found', (done) => {
            const req = { params: {} };
            sinon.replace(timeRepository, 'findById', sinon.fake.resolves(false));

            timeController.details(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                    done();
                });
        });

        it('should fetch the time entry details if it is found', (done) => {
            const req = { params: {} };
            sinon.replace(timeRepository, 'findById', sinon.fake.resolves(true));

            timeController.details(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('update', () => {
        it('should throw an error if the time entry is not found', (done) => {
            const req = { params: {}, user: {}, body: {} };
            sinon.replace(timeRepository, 'update', sinon.fake.resolves(false));

            timeController.update(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                    done();
                });
        });

        it('should update the time entry if it is found', (done) => {
            const req = { params: {}, user: {}, body: {} };
            sinon.replace(timeRepository, 'update', sinon.fake.resolves(true));

            timeController.update(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('delete', () => {
        it('should throw an error if the time entry is not found', (done) => {
            const req = { params: {} };
            sinon.replace(timeRepository, 'delete', sinon.fake.resolves(false));

            timeController.delete(req)
                .then(() => done(new Error('Error')))
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                    done();
                });
        });

        it('should delete the time entry if it is found', (done) => {
            const req = { params: {} };
            sinon.replace(timeRepository, 'delete', sinon.fake.resolves(true));

            timeController.delete(req)
                .then((response) => {
                    expect(response.status).to.be.equal(200);
                    done();
                })
                .catch(err => done(err));
        });
    });
});
