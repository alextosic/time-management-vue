<template>
    <v-container class="auth-page fill-height" fluid>
        <v-row align="center" justify="center" class="auth-page-row">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-4">
                    <v-card-title class="text-center justify-center pa-12">
                        <v-col cols="8">
                            <v-img src="../../assets/images/toptal-logo.png" alt="Toptal Logo"></v-img>
                        </v-col>
                        <h1 class="display-1">Time Management</h1>
                    </v-card-title>
                    <v-tabs v-model="currentTab" grow>
                        <v-tab>Login</v-tab>
                        <v-tab>Register</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="currentTab">
                        <v-tab-item class="pa-12">
                            <Login></Login>
                        </v-tab-item>
                        <v-tab-item class="pa-12">
                            <Register></Register>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import Login from '../Auth/LoginComponent.vue';
import Register from '../Auth/RegisterComponent.vue';

export default {
    components: {
        Login,
        Register,
    },
    data() {
        return {
            currentTab: null,
        };
    },
};

</script>

<style type="text/scss" lang="scss">
    @import '../../styles/layout/AuthPage.scss';
</style>
