<template>
    <div :class="page">
        <v-tabs v-model="currentTab" grow background-color="primary" dark>
            <v-tab>Update Info</v-tab>
            <v-tab>Update Password</v-tab>
        </v-tabs>
        <v-tabs-items v-model="currentTab">
            <v-tab-item class="pa-12">
                <UserUpdateInfo :page="page" :existingData="existingData"></UserUpdateInfo>
            </v-tab-item>
            <v-tab-item class="pa-12">
                <UserUpdatePassword :page="page"></UserUpdatePassword>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>

import UserUpdateInfo from './UserUpdateInfoComponent.vue';
import UserUpdatePassword from './UserUpdatePasswordComponent.vue';

export default {
    props: {
        page: {
            type: String,
        },
        existingData: {
            type: Object,
        },
    },
    components: {
        UserUpdateInfo,
        UserUpdatePassword,
    },
    data() {
        return {
            currentTab: null,
        };
    },
};

</script>
