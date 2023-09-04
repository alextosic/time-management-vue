const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BaseController = require('./baseController');
const appConstants = require('../constants/app');

const CreatedResponse = require('../responses/success/createdResponse');
const OkResponse = require('../responses/success/okResponse');
const UnauthorizedResponse = require('../responses/error/unauthorizedResponse');
const UnprocessableResponse = require('../responses/error/unprocessableResponse');
const NotFoundResponse = require('../responses/error/notFoundResponse');

const { userRepository } = require('../db/repositories/userRepository');

class AccountController extends BaseController {
    async register(req) {
        const fields = ['firstName', 'lastName', 'email', 'password'];
        const existingUser = await userRepository.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            throw new UnprocessableResponse('A user with that email address already exists.');
        }

        const createdUser = await userRepository.create(req.body, { fields });
        const token = jwt.sign({ id: createdUser.id }, appConstants.jwt.secret);

        return new CreatedResponse('User registered successfully.', { token });
    }

    async login(req) {
        const { email, password } = req.body;
        const attributes = [...userRepository.attributes, 'password'];
        const foundUser = await userRepository.findOne({ where: { email }, attributes });

        if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
            throw new UnauthorizedResponse('Wrong email or password.');
        }

        const token = jwt.sign({ id: foundUser.id }, appConstants.jwt.secret)
        return new OkResponse('User logged in successfully.', { token });
    }

    async getProfile(req) {
        return new OkResponse('Profile fetched.', req.user);
    }

    async updateProfile(req) {
        const fields = ['firstName', 'lastName', 'email', 'preferredWorkingHours'];
        const updatedUser = await userRepository.update(req.user.id, req.body, { fields });

        if (!updatedUser) {
            throw new NotFoundResponse('User not found.');
        }

        return new OkResponse('Profile updated.', updatedUser);
    }

    async updatePassword(req) {
        const fields = ['password'];
        const attributes = [...userRepository.attributes, 'password'];
        const foundUser = await userRepository.findById(req.user.id, { attributes });

        if (!bcrypt.compareSync(req.body.currentPassword, foundUser.password)) {
            throw new UnprocessableResponse('Wrong current password.');
        }

        const updatedUser = await userRepository.update(req.user.id, req.body, { fields });
        return new OkResponse('Profile updated.', updatedUser);
    }
}

module.exports = {
    AccountController,
    accountController: new AccountController(),
};
