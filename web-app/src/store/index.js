import Vue from 'vue';
import Vuex from 'vuex';

import api from './modules/api';
import messages from './modules/messages';
import account from './modules/account';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        api,
        messages,
        account,
    },
});
