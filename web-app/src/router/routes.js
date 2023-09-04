import AuthPage from '../components/layout/AuthPage.vue';
import MainPage from '../components/layout/MainPage.vue';
import HomePage from '../components/layout/HomePage.vue';

import UserPage from '../components/layout/User/UserPage.vue';
import UserListPage from '../components/layout/User/UserListPage.vue';
import UserAddPage from '../components/layout/User/UserAddPage.vue';
import UserEditPage from '../components/layout/User/UserEditPage.vue';

import TimePage from '../components/layout/Time/TimePage.vue';
import TimeListPage from '../components/layout/Time/TimeListPage.vue';
import TimeAddPage from '../components/layout/Time/TimeAddPage.vue';
import TimeEditPage from '../components/layout/Time/TimeEditPage.vue';

import ProfilePage from '../components/layout/ProfilePage.vue';
import FourOhFourPage from '../components/layout/FourOhFourPage.vue';

export default [
    {
        path: '/auth',
        component: AuthPage,
    },
    {
        path: '/',
        component: MainPage,
        children: [
            {
                path: '',
                component: HomePage,
            },
            {
                path: 'user',
                component: UserPage,
                children: [
                    {
                        path: '/',
                        component: UserListPage,
                    },
                    {
                        path: 'add',
                        component: UserAddPage,
                    },
                    {
                        path: ':id',
                        component: UserEditPage,
                    },
                ],
            },
            {
                path: 'time',
                component: TimePage,
                children: [
                    {
                        path: '/',
                        component: TimeListPage,
                    },
                    {
                        path: 'add',
                        component: TimeAddPage,
                    },
                    {
                        path: ':id',
                        component: TimeEditPage,
                    },
                ],
            },
            {
                path: 'profile',
                component: ProfilePage,
            },
        ],
    },
    {
        path: '*',
        component: FourOhFourPage,
    },
];
