<template>
    <v-app>
        <v-content>
            <router-view></router-view>
            <Messages></Messages>
        </v-content>
    </v-app>
</template>

<script>

import Messages from './components/common/Messages.vue';

export default {
    components: {
        Messages,
    },
    computed: {
        token() {
            return this.$store.getters['account/getToken'];
        },
    },
    watch: {
        token(value) {
            if (value === '') {
                this.$router.push('/auth');
            } else {
                this.$router.push('/');
            }
        },
    },
};

</script>

<style type="text/scss" lang="scss">
    @import './styles/App.scss';
</style>
