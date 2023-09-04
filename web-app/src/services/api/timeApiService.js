import BaseApiService from './baseApiService';

class TimeApiService extends BaseApiService {
    constructor() {
        super('time');
    }

    async list({ query }) {
        return this.request({ method: 'GET', url: '/', query });
    }

    async export({ query }) {
        return this.request({ method: 'GET', url: '/export', query });
    }

    async listPerUser() {
        return this.request({ method: 'GET', url: '/me' });
    }

    async exportPerUser() {
        return this.request({ method: 'GET', url: '/me/export' });
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

    async delete({ id }) {
        return this.request({ method: 'DELETE', url: `/${id}` });
    }
}

export default new TimeApiService();
