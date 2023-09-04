<template>
    <v-container class="profile-page" fluid>
        <v-row>
            <h1 class="display-2 pa-4">Profile</h1>
        </v-row>
        <v-row align="center" justify="center" class="mt-12">
            <v-col cols="6">
                <UserUpdate page="profile" :existingData="profileData"></UserUpdate>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import UserUpdate from '../User/UserUpdateComponent.vue';

export default {
    components: {
        UserUpdate,
    },
    computed: {
        profileData() {
            return this.$store.getters['account/getProfile'];
        },
    },
};

</script>
