export default {
    namespaced: true,
    state: {
        profile: {},
        token: '',
    },
    getters: {
        getProfile(state) {
            return state.profile;
        },
        getToken(state) {
            return state.token;
        },
    },
    mutations: {
        setProfile(state, profile) {
            state.profile = profile;
        },
        setToken(state, token) {
            state.token = token;
        },
    },
    actions: {
        loadToken(context) {
            if (context.getters.getToken === '') {
                const token = localStorage.getItem('toptal_time_management_token');

                if (token) {
                    context.commit('setToken', token);
                    context.commit('api/setAuthorization', token, { root: true });
                }
            }
        },
        saveToken(context, token) {
            localStorage.setItem('toptal_time_management_token', token);

            context.commit('setToken', token);
            context.commit('api/setAuthorization', token, { root: true });
        },
        removeToken(context) {
            localStorage.removeItem('toptal_time_management_token');

            context.commit('setToken', '');
            context.commit('api/setAuthorization', '', { root: true });
        },
        async register(context, body) {
            const response = await context.dispatch('api/request', {
                serviceName: 'account',
                requestType: 'register',
                data: { body },
            }, { root: true });

            if (response && response.token) {
                context.dispatch('saveToken', response.token);
            }
        },
        async login(context, body) {
            const response = await context.dispatch('api/request', {
                serviceName: 'account',
                requestType: 'login',
                data: { body },
            }, { root: true });

            if (response && response.token) {
                context.dispatch('saveToken', response.token);
            }
        },
        logout(context) {
            context.dispatch('removeToken');
            context.commit('setProfile', {});
        },
        async loadProfile(context) {
            context.dispatch('loadToken');

            if (context.getters.getToken !== '' && !context.getters.getProfile.id) {
                const response = await context.dispatch('api/request', {
                    serviceName: 'account',
                    requestType: 'getProfile',
                    hideMessage: true,
                }, { root: true });

                if (response) {
                    context.commit('setProfile', response);
                }
            }
        },
    },
};
