<template>
    <form @submit.prevent="submit">
        <ValidationProvider name="current password" :rules="`required|min:${passwordMin}|alpha_num`"
            v-slot="{ errors }" v-if="page === 'profile'"
        >
            <v-text-field
                class="mt-2"
                v-model="formData.currentPassword"
                type="password"
                label="Current password *"
                :error-messages="errors[0]"
                required
            ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="password" :rules="`required|min:${passwordMin}|alpha_num`" v-slot="{ errors }">
            <v-text-field
                class="mt-2"
                v-model="formData.password"
                type="password"
                label="Password *"
                :error-messages="errors[0]"
                required
            ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="confirm password" rules="required|confirmed:password" v-slot="{ errors }">
            <v-text-field
                class="mt-2"
                v-model="formData.confirmPassword"
                type="password"
                label="Confirm password *"
                :error-messages="errors[0]"
                required
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
    },
    data() {
        return {
            formData: {
                currentPassword: null,
                password: '',
                confirmPassword: '',
            },
        };
    },
    computed: {
        profile() {
            return this.$store.getters['account/getProfile'];
        },
        passwordMin() {
            return appConstants.user.password.minLength;
        },
        request() {
            if (this.page === 'profile') {
                return { serviceName: 'account', id: this.profile.id, requestType: 'updatePassword' };
            }

            return { serviceName: 'user', id: this.$route.params.id, requestType: 'updatePassword' };
        },
    },
    methods: {
        async submit() {
            await this.$store.dispatch('api/request', {
                serviceName: this.request.serviceName,
                requestType: this.request.requestType,
                data: { id: this.request.id, body: this.formData },
            });

            if (this.page === 'user') {
                this.$router.push('/user');
            }
        },
        back() {
            this.$router.push('/user');
        },
    },
};
</script>
