import accountApiService from '../../services/api/accountApiService';
import timeApiService from '../../services/api/timeApiService';
import userApiService from '../../services/api/userApiService';

export default {
    namespaced: true,
    state: {
        services: {
            account: accountApiService,
            time: timeApiService,
            user: userApiService,
        },
    },
    getters: {
        getService(state) {
            return service => state.services[service];
        },
    },
    mutations: {
        setAuthorization(state, token) {
            Object.values(state.services).forEach((service) => {
                service.setAuthorization(token);
            });
        },
    },
    actions: {
        async request(context, {
            serviceName,
            requestType,
            data = {},
            hideMessage,
        }) {
            const service = context.getters.getService(serviceName);

            try {
                const response = await service[requestType](data);

                if (response && response.data) {
                    if (!hideMessage) {
                        const message = { text: response.data.msg, type: 'success' };
                        context.dispatch('messages/add', [message], { root: true });
                    }

                    return response.data.data;
                }

                return null;
            } catch (err) {
                console.log(err);
                if (err && err.response && err.response.data) {
                    const { errors } = err.response.data;
                    const messages = errors && errors.length > 0 ? [{ text: errors[0].msg, type: 'error' }] : [];

                    context.dispatch('messages/add', messages, { root: true });
                }

                if (err && err.response && err.response.status === 401) {
                    context.dispatch('account/logout', null, { root: true });
                }

                return null;
            }
        },
    },
};
