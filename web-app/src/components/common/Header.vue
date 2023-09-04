<template>
    <v-app-bar class="header" fixed>
        <div class="header-logo py-3 mr-5" @click="homePage">
            <img src="../../assets/images/toptal-logo.png" alt="Toptal Logo" />
        </div>

        <v-toolbar-title @click="homePage">
            Time Management
        </v-toolbar-title>

        <div class="flex-grow-1"></div>
        <v-toolbar-items>
            <v-btn v-if="isAdmin || isUser" min-width="100px" text to="/time">Times</v-btn>
            <v-btn v-if="isAdmin || isUserManager" min-width="100px" text to="/user">Users</v-btn>
        </v-toolbar-items>

        <div>
            Welcome,
            <span class="blue--text text--darken-4">{{ profile.firstName }} {{ profile.lastName }}</span>
        </div>

        <v-menu bottom left offset-y attach=".header">
            <template v-slot:activator="{ on }">
                <v-btn fab outlined small color="info" class="ml-5" v-on="on">
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </template>
            <v-list min-width="150px">
                <v-list-item @click="profilePage">
                    <v-list-item-icon>
                        <v-icon>mdi-settings</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="logout">
                    <v-list-item-icon>
                        <v-icon>mdi-logout</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script>

import appConstants from '../../constants/app';

export default {
    computed: {
        profile() {
            return this.$store.getters['account/getProfile'];
        },
        isAdmin() {
            return parseInt(this.profile.role, 10) <= parseInt(appConstants.user.roles.ADMIN, 10);
        },
        isUser() {
            return parseInt(this.profile.role, 10) === parseInt(appConstants.user.roles.USER, 10);
        },
        isUserManager() {
            return parseInt(this.profile.role, 10) === parseInt(appConstants.user.roles.USER_MANAGER, 10);
        },
    },
    methods: {
        homePage() {
            this.$router.push('/');
        },
        profilePage() {
            this.$router.push('/profile');
        },
        logout() {
            this.$store.dispatch('account/logout');
            this.$router.push('/auth');
        },
    },
};

</script>

<style type="text/scss" lang="scss">
    @import '../../styles/common/Header.scss';
</style>
