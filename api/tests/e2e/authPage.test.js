const { Selector } = require('testcafe');

fixture('authPage')
    .page('http://localhost:4000');

test('Has login form', async (t) => {
    const token = await t.eval(() => localStorage.getItem('toptal_time_management_token'));

    if (!token) {
        const login = Selector('.login-form');
        await t.expect(login.exists).ok();

        const inputs = login.find('input');
        await t.expect(inputs.count).eql(2);

        const submitButton = login.find('button[type=submit]');
        await t.expect(submitButton.count).eql(1);
    }
});

test('Has register form', async (t) => {
    const token = await t.eval(() => localStorage.getItem('toptal_time_management_token'));

    if (!token) {
        const registerTabButton = Selector('.v-tab').withText('REGISTER');

        await t.click(registerTabButton);

        const register = Selector('.register-form');
        await register();
        await t.expect(register.exists).ok();

        const inputs = register.find('input');
        await t.expect(inputs.count).eql(5);

        const submitButton = register.find('button[type=submit]');
        await t.expect(submitButton.count).eql(1);
    }
});

test('Will register user if it doesn\'t exist and redirect to /time page, else show alert and stay on /auth page', async (t) => {
    const token = await t.eval(() => localStorage.getItem('toptal_time_management_token'));

    if (!token) {
        const registerTabButton = Selector('.v-tab').withText('REGISTER');

        await t.click(registerTabButton);

        const register = Selector('.register-form');
        await register();

        await t
            .typeText('#register-first-name', 'Aleksandar')
            .typeText('#register-last-name', 'Tosic')
            .typeText('#register-email', 'tosha90@gmail.com')
            .typeText('#register-password', 'password')
            .typeText('#register-confirm-password', 'password')
            .click('#register-submit');

        const errorMessage = Selector('.v-alert').withText('A user with that email address already exists.');
        await errorMessage();

        const location = await t.eval(() => window.location);

        if (location.pathname === '/auth') {
            await t.expect(errorMessage.exists).ok();
        } else {
            await t.expect(errorMessage.exists).notOk();
        }
    }
});

test('Will login user and redirect to /time page', async (t) => {
    const token = await t.eval(() => localStorage.getItem('toptal_time_management_token'));

    if (!token) {
        await t
            .typeText('#login-email', 'tosha90@gmail.com')
            .typeText('#login-password', 'password')
            .click('#login-submit');

        const location = await t.eval(() => window.location);

        await t.expect(location.pathname).eql('/time');
    }
});

test('Will login admin and redirect to /time page', async (t) => {
    const token = await t.eval(() => localStorage.getItem('toptal_time_management_token'));

    if (!token) {
        await t
            .typeText('#login-email', 'superadmin@toptal.com')
            .typeText('#login-password', 'toptalsuperadmin')
            .click('#login-submit');

        const location = await t.eval(() => window.location);

        await t.expect(location.pathname).eql('/time');
    }
});
