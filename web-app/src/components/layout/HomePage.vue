<template>
    <v-container class="home-page" fluid></v-container>
</template>

<script>

import appConstants from '../../constants/app';

export default {
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            const user = vm.$store.getters['account/getProfile'];

            if (user.role === appConstants.user.roles.USER_MANAGER) {
                next('/user');
            } else {
                next('/time');
            }
        });
    },
};

</script>
