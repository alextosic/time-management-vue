const BaseController = require('./baseController');

const CreatedResponse = require('../responses/success/createdResponse');
const OkResponse = require('../responses/success/okResponse');
const UnprocessableResponse = require('../responses/error/unprocessableResponse');
const NotFoundResponse = require('../responses/error/notFoundResponse');

const { userRepository } = require('../db/repositories/userRepository');

const UserPdfService = require('../services/userPdfService');

class UserController extends BaseController {
    async list(req) {
        const pagination = this.getPagination(req);
        const list = await userRepository.findAndCount({
            where: {
                role: { [userRepository.operations.gt]: req.user.role },
            },
            ...pagination,
        });

        return new OkResponse('User list fetched.', { list: list.rows, count: list.count });
    }

    async export(req) {
        const pagination = this.getPagination(req);
        const list = await userRepository.find({
            where: {
                role: { [userRepository.operations.gt]: req.user.role },
            },
            ...pagination,
        });

        const pdfService = new UserPdfService();
        const file = await pdfService.createFile(list);

        return new CreatedResponse('User list PDF generated.', file);
    }

    async details(req) {
        const user = await userRepository.findById(req.params.id);
        
        if (!user) {
            throw new NotFoundResponse('User not found.');
        }

        return new OkResponse('User found.', user);
    }

    async create(req) {
        const fields = ['firstName', 'lastName', 'email', 'password', 'preferredWorkingHours', 'role'];
        const existingUser = await userRepository.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            throw new UnprocessableResponse('A user with that email address already exists.');
        }

        const createdUser = await userRepository.create(req.body, { fields });
        return new CreatedResponse('User created.', await userRepository.findById(createdUser.id));
    }

    async update(req) {
        const fields = ['firstName', 'lastName', 'email', 'preferredWorkingHours', 'role'];
        const updatedUser = await userRepository.update(req.params.id, req.body, { fields });

        if (!updatedUser) {
            throw new NotFoundResponse('User not found.');
        }

        return new OkResponse('User updated.', updatedUser);
    }

    async updatePassword(req) {
        const fields = ['password'];
        const updatedUser = await userRepository.update(req.params.id, req.body, { fields });

        if (!updatedUser) {
            throw new NotFoundResponse('User not found.');
        }

        return new OkResponse('User updated.', updatedUser);
    }

    async delete(req) {
        const deletedUserId = await userRepository.delete(req.params.id);

        if (!deletedUserId) {
            throw new NotFoundResponse('User not found.');
        }

        return new OkResponse('User deleted.', { id: deletedUserId });
    }
}

module.exports = {
    UserController,
    userController: new UserController(),
};
