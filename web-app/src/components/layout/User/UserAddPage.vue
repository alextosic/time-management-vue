<template>
    <v-container class="user-add-page" fluid>
        <v-row>
            <h1 class="display-2 pa-4">Add User</h1>
        </v-row>
        <v-row align="center" justify="center" class="mt-12">
            <v-col cols="6">
                <UserCreate page="create"></UserCreate>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import UserCreate from '../../User/UserCreateComponent.vue';

export default {
    components: {
        UserCreate,
    },
};

</script>
