import axios from 'axios';

import apiUtils from '../../utils/apiUtils';

const { NODE_ENV, VUE_APP_DEV_SERVER, VUE_APP_PROD_SERVER } = process.env;

class BaseApiService {
    constructor(module) {
        this.server = axios.create({
            baseURL: `${NODE_ENV === 'development' ? VUE_APP_DEV_SERVER : VUE_APP_PROD_SERVER}/${module}/`,
            timeout: 10000,
        });
    }

    setAuthorization(token) {
        this.server.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    async request({
        method,
        url,
        body,
        query,
    }) {
        try {
            const response = await this.server.request({
                method,
                url,
                data: apiUtils.removeUnsetProps(body),
                params: query,
            });

            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default BaseApiService;
