import store from '../store';

export default {
    async authenticate(to, from, next) {
        await store.dispatch('account/loadProfile');

        if (to.path !== '/auth' && !store.getters['account/getProfile'].id) {
            next('/auth');
        } else if (to.path === '/auth' && store.getters['account/getProfile'].id) {
            next('/');
        } else {
            next();
        }
    },
};
