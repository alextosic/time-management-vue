module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    time: {
        maxPerDay: 24,
        date: {
            min: '1970-01-01',
            max: '9999-01-01',
        },
    },
    user: {
        password: {
            minLength: 6,
            rounds: 10,
        },
        roles: {
            SUPERADMIN: '0',
            ADMIN: '1',
            USER_MANAGER: '2',
            USER: '3',
        },
    },
};
