import BaseApiService from './baseApiService';

class AccountApiService extends BaseApiService {
    constructor() {
        super('account');
    }

    async register({ body }) {
        return this.request({ method: 'POST', url: '/register', body });
    }

    async login({ body }) {
        return this.request({ method: 'POST', url: '/login', body });
    }

    async getProfile() {
        return this.request({ method: 'GET', url: '/me' });
    }

    async updateProfile({ body }) {
        return this.request({ method: 'PATCH', url: '/me', body });
    }

    async updatePassword({ body }) {
        return this.request({ method: 'PATCH', url: '/me/password', body });
    }
}

export default new AccountApiService();
