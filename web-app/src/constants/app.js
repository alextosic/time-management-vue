export default {
    time: {
        maxPerDay: 24,
    },
    user: {
        password: {
            minLength: 6,
        },
        roles: {
            SUPERADMIN: '0',
            ADMIN: '1',
            USER_MANAGER: '2',
            USER: '3',
        },
    },
};
