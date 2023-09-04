<template>
    <div class="time-page">
        <router-view></router-view>
    </div>
</template>

<script>

import appConstants from '../../../constants/app';

export default {
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.redirect(next);
        });
    },
    beforeRouteUpdate(to, from, next) {
        this.redirect(next);
    },
    computed: {
        profile() {
            return this.$store.getters['account/getProfile'];
        },
        isUserManager() {
            return this.profile.role === appConstants.user.roles.USER_MANAGER;
        },
    },
    methods: {
        redirect(next) {
            if (this.isUserManager) {
                next('/user');
            } else {
                next();
            }
        },
    },
};
</script>
