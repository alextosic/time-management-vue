import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes';
import routeGuards from './routeGuards';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach(routeGuards.authenticate);

export default router;
