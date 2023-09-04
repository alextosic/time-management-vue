<template>
    <div class="user-page">
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
        isUser() {
            return this.profile.role === appConstants.user.roles.USER;
        },
    },
    methods: {
        redirect(next) {
            if (this.isUser) {
                next('/');
            } else {
                next();
            }
        },
    },
};

</script>
