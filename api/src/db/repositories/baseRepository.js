const { Op } = require('sequelize');

class BaseRepository {
    constructor(model, attributes) {
        this.model = model;
        this.attributes = attributes;

        this.operations = {
            or: Op.or,
            and: Op.and,
            not: Op.not,
            gt: Op.gt,
            lt: Op.lt,
            gte: Op.gte,
            lte: Op.lte,
        };
    }

    async findById(id, options) {
        try {
            return this.model.findOne({ where: { id }, attributes: this.attributes, ...options });
        } catch (err) {
            throw err;
        }
    }

    async findOne(options) {
        try {
            return this.model.findOne({ attributes: this.attributes, ...options });
        } catch (err) {
            throw err;
        }
    }

    async find(options) {
        try {
            return this.model.findAll({ attributes: this.attributes, ...options });
        } catch (err) {
            throw err;
        }
    }

    async findAndCount(options) {
        try {
            return this.model.findAndCountAll({ attributes: this.attributes, ...options });
        } catch (err) {
            throw err;
        }
    }

    async create(data, options) {
        try {
            return this.model.create(data, options);
        } catch (err) {
            throw err;
        }
    }

    async update(id, data, options) {
        try {
            const foundModel = await this.findById(id);

            if (!foundModel) {
                return null;
            }

            await foundModel.update(data, options);
            return this.findById(id);
        } catch (err) {
            throw err;
        }
    }

    async delete(id) {
        try {
            const foundModel = await this.findById(id);

            if (!foundModel) {
                return null;
            }

            await foundModel.destroy();
            return id;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = BaseRepository;
