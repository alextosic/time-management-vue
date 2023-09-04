<template>
    <v-container class="user-edit-page" fluid v-show="!!user.id">
        <v-row>
            <h1 class="display-2 pa-4">Edit User</h1>
        </v-row>
        <v-row align="center" justify="center" class="mt-12">
            <v-col cols="6">
                <UserUpdate page="user" :existingData="user"></UserUpdate>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import UserUpdate from '../../User/UserUpdateComponent.vue';

export default {
    components: {
        UserUpdate,
    },
    data() {
        return {
            user: {},
        };
    },
    async mounted() {
        await this.getUser();
    },
    methods: {
        async getUser() {
            const user = await this.$store.dispatch('api/request', {
                serviceName: 'user',
                requestType: 'details',
                data: { id: this.$route.params.id },
                hideMessage: true,
            });

            if (user) {
                this.user = Object.assign({}, user);
            } else {
                this.$router.push('/user');
            }
        },
    },
};

</script>
