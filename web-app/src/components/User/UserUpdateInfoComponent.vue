<template>
    <form @submit.prevent="submit">
        <ValidationProvider name="first name" rules="required" v-slot="{ errors }">
            <v-text-field
                v-model="formData.firstName"
                label="First name *"
                :error-messages="errors[0]"
                required
            ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="last name" rules="required" v-slot="{ errors }">
            <v-text-field
                class="mt-2"
                v-model="formData.lastName"
                label="Last name *"
                :error-messages="errors[0]"
                required
            ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
            <v-text-field
                class="mt-2"
                v-model="formData.email"
                label="Email *"
                :error-messages="errors[0]"
                required
            ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="role" rules="required" v-slot="{ errors }" v-if="page === 'user'">
            <v-select
                class="mt-2"
                :items="allowedRoles"
                v-model="formData.role"
                label="Role *"
                :error-messages="errors[0]"
                required
            ></v-select>
        </ValidationProvider>
        <ValidationProvider name="preferred working hours">
            <v-text-field
                class="mt-2"
                v-model="formData.preferredWorkingHours"
                type="number"
                label="Preferred working hours"
            ></v-text-field>
        </ValidationProvider>
        <div class="mt-8 d-flex">
            <v-btn color="success" type="submit" depressed large>Update</v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="page === 'user'" color="error" type="button" depressed large @click="back">Cancel</v-btn>
        </div>
    </form>
</template>

<script>

import appConstants from '../../constants/app';

export default {
    props: {
        page: {
            type: String,
        },
        existingData: {
            type: Object,
        },
    },
    data() {
        return {
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                preferredWorkingHours: null,
                role: null,
            },
        };
    },
    computed: {
        profile() {
            return this.$store.getters['account/getProfile'];
        },
        request() {
            if (this.page === 'profile') {
                return { serviceName: 'account', id: this.profile.id, requestType: 'updateProfile' };
            }

            return { serviceName: 'user', id: this.$route.params.id, requestType: 'update' };
        },
        allowedRoles() {
            const allowedRoleKeys = Object.keys(appConstants.user.roles)
                .filter(roleKey => appConstants.user.roles[roleKey] > this.profile.role);

            return allowedRoleKeys.map(allowedRoleKey => ({
                text: allowedRoleKey,
                value: appConstants.user.roles[allowedRoleKey],
            }));
        },
    },
    watch: {
        existingData() {
            this.updateFormData();
        },
    },
    mounted() {
        this.updateFormData();
    },
    methods: {
        updateFormData() {
            this.formData = Object.assign({}, this.existingData);
        },
        async submit() {
            const response = await this.$store.dispatch('api/request', {
                serviceName: this.request.serviceName,
                requestType: this.request.requestType,
                data: { id: this.request.id, body: this.formData },
            });

            if (this.page === 'profile') {
                this.$store.commit('account/setProfile', response);
            } else {
                this.$router.push('/user');
            }
        },
        back() {
            this.$router.push('/user');
        },
    },
};

</script>
