import BaseApiService from './baseApiService';

class UserApiService extends BaseApiService {
    constructor() {
        super('user');
    }

    async list({ query }) {
        return this.request({ method: 'GET', url: '/', query });
    }

    async export() {
        return this.request({ method: 'GET', url: '/export' });
    }

    async details({ id }) {
        return this.request({ method: 'GET', url: `/${id}` });
    }

    async create({ body }) {
        return this.request({ method: 'POST', url: '/', body });
    }

    async update({ id, body }) {
        return this.request({ method: 'PATCH', url: `/${id}`, body });
    }

    async updatePassword({ id, body }) {
        return this.request({ method: 'PATCH', url: `/${id}/password`, body });
    }

    async delete({ id }) {
        return this.request({ method: 'DELETE', url: `/${id}` });
    }
}

export default new UserApiService();
