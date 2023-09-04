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
        <ValidationProvider name="role" rules="required" v-slot="{ errors }">
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
                label="Preferred working hours"
            ></v-text-field>
        </ValidationProvider>
        <div class="mt-8 d-flex">
            <v-btn color="success" type="submit" depressed large>Create</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" type="button" depressed large @click="back">Cancel</v-btn>
        </div>
    </form>
</template>

<script>

import appConstants from '../../constants/app';

export default {
    data() {
        return {
            formData: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: null,
                preferredWorkingHours: null,
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
        allowedRoles() {
            const allowedRoleKeys = Object.keys(appConstants.user.roles)
                .filter(roleKey => appConstants.user.roles[roleKey] > this.profile.role);

            return allowedRoleKeys.map(allowedRoleKey => ({
                text: allowedRoleKey,
                value: appConstants.user.roles[allowedRoleKey],
            }));
        },
    },
    mounted() {
        if (this.allowedRoles.length > 0) {
            this.formData.role = this.allowedRoles[0].value;
        }
    },
    methods: {
        async submit() {
            const response = await this.$store.dispatch('api/request', {
                serviceName: 'user',
                requestType: 'create',
                data: { body: this.formData },
            });

            if (response) {
                this.$router.push('/user');
            }
        },
        back() {
            this.$router.push('/user');
        },
    },
};

</script>
