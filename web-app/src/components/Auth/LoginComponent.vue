<template>
    <div class="login-form">
        <form @submit.prevent="submit">
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
                <v-text-field
                    id="login-email"
                    v-model="formData.email"
                    label="Email *"
                    :error-messages="errors[0]"
                    required
                    autofocus
                ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="password" :rules="`required|min:${passwordMin}|alpha_num`" v-slot="{ errors }">
                <v-text-field
                    id="login-password"
                    class="mt-2"
                    v-model="formData.password"
                    type="password"
                    label="Password *"
                    :error-messages="errors[0]"
                    required
                ></v-text-field>
            </ValidationProvider>
            <v-btn id="login-submit" class="mt-8" color="success" type="submit" depressed large>Login</v-btn>
        </form>
    </div>
</template>

<script>

import appConstants from '../../constants/app';

export default {
    data() {
        return {
            formData: {
                email: '',
                password: '',
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
            await this.$store.dispatch('account/login', this.formData);
        },
    },
};

</script>
