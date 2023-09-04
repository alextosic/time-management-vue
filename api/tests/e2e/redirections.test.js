fixture('redirections')
    .page('http://localhost:4000');

test('Redirect to auth page if token doesn\'t exist', async (t) => {
    const token = await t.eval(() => localStorage.getItem('toptal_time_management_token'));
    const location = await t.eval(() => window.location);

    if (!token) {
        await t.expect(location.pathname).eql('/auth');
    }
});

test('Redirect to home page if token exists', async (t) => {
    const token = await t.eval(() => localStorage.getItem('toptal_time_management_token'));
    const location = await t.eval(() => window.location);

    if (token) {
        await t.expect(['/time', '/user']).contains(location.patname);
    }
});
