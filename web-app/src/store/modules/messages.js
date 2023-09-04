export default {
    namespaced: true,
    state: {
        list: [],
    },
    getters: {
        getList(state) {
            return state.list;
        },
    },
    mutations: {
        addMessage(state, message) {
            state.list.unshift(message);
        },
        removeMessage(state) {
            state.list.pop();
        },
    },
    actions: {
        add(context, messages) {
            messages.forEach((message) => {
                context.commit('addMessage', message);

                setTimeout(() => {
                    context.commit('removeMessage');
                }, 5000);
            });
        },
    },
};
