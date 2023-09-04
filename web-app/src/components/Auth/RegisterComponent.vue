<template>
    <div class="register-form">
        <form @submit.prevent="submit">
            <ValidationProvider name="first name" rules="required" v-slot="{ errors }">
                <v-text-field
                    id="register-first-name"
                    v-model="formData.firstName"
                    label="First name *"
                    :error-messages="errors[0]"
                    required
                ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="last name" rules="required" v-slot="{ errors }">
                <v-text-field
                    id="register-last-name"
                    class="mt-2"
                    v-model="formData.lastName"
                    label="Last name *"
                    :error-messages="errors[0]"
                    required
                ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
                <v-text-field
                    id="register-email"
                    class="mt-2"
                    v-model="formData.email"
                    label="Email *"
                    :error-messages="errors[0]"
                    required
                ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="password" :rules="`required|min:${passwordMin}|alpha_num`" v-slot="{ errors }">
                <v-text-field
                    id="register-password"
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
                    id="register-confirm-password"
                    class="mt-2"
                    v-model="formData.confirmPassword"
                    type="password"
                    label="Confirm password *"
                    :error-messages="errors[0]"
                    required
                ></v-text-field>
            </ValidationProvider>
            <v-btn id="register-submit" class="mt-8" color="success" type="submit" depressed large>Register</v-btn>
        </form>
    </div>
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
            },
        };
    },
    computed: {
        passwordMin() {
            return appConstants.user.password.minLength;
        },
    },
    methods: {
        async submit() {
            await this.$store.dispatch('account/register', this.formData);
        },
    },
};

</script>
