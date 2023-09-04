<template>
    <div :class="page">
        <form @submit.prevent="submit">
            <ValidationProvider name="date" rules="required" v-slot="{ errors }">
                <Datepicker label="Date *" v-model="formData.date" noIcon></Datepicker>
            </ValidationProvider>
            <ValidationProvider name="length" :rules="`required|max_value:${lengthMax}`" v-slot="{ errors }">
                <v-text-field
                    class="mt-2"
                    v-model="formData.length"
                    label="Length *"
                    type="number"
                    step="0.01"
                    :error-messages="errors[0]"
                    required
                ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="note">
                <v-textarea
                    class="mt-2"
                    v-model="formData.note"
                    label="Note"
                    outlined
                ></v-textarea>
            </ValidationProvider>
            <ValidationProvider name="user" v-if="isAdmin">
                <v-select
                    class="mt-2"
                    v-model="formData.userId"
                    :items="userList"
                    label="User *"
                ></v-select>
            </ValidationProvider>
            <div class="mt-8 d-flex">
                <v-btn color="success" type="submit" depressed large>
                    {{ page === 'create' ? 'Create' : 'Update' }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" type="button" depressed large @click="back">Cancel</v-btn>
            </div>
        </form>
    </div>
</template>

<script>

import moment from 'moment';

import Datepicker from '../common/Datepicker.vue';
import appConstants from '../../constants/app';

export default {
    components: {
        Datepicker,
    },
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
                date: moment().format('YYYY-MM-DD'),
                length: null,
                note: '',
                userId: null,
            },
            userList: [
                {
                    text: 'Me',
                    value: null,
                },
            ],
        };
    },
    computed: {
        profile() {
            return this.$store.getters['account/getProfile'];
        },
        isAdmin() {
            return parseInt(this.profile.role, 10) <= parseInt(appConstants.user.roles.ADMIN, 10);
        },
        lengthMax() {
            return appConstants.time.maxPerDay;
        },
        request() {
            if (this.page === 'create') {
                return { serviceName: 'time', requestType: 'create' };
            }

            return { serviceName: 'time', requestType: 'update' };
        },
    },
    watch: {
        existingData() {
            this.updateFormData();
        },
    },
    async mounted() {
        this.updateFormData();

        if (this.isAdmin) {
            await this.getUserList();
        }
    },
    methods: {
        updateFormData() {
            if (this.existingData) {
                this.formData = Object.assign({}, this.existingData);

                if (this.profile.id === this.formData.userId) {
                    this.formData.userId = null;
                }
            }
        },
        async getUserList() {
            const response = await this.$store.dispatch('api/request', {
                serviceName: 'user',
                requestType: 'list',
                hideMessage: true,
            });

            if (response) {
                this.userList = [
                    {
                        text: 'Me',
                        value: null,
                    },
                    ...response.list.map(user => ({
                        text: `${user.firstName} ${user.lastName}`,
                        value: user.id,
                    })),
                ];
            }
        },
        async submit() {
            const response = await this.$store.dispatch('api/request', {
                serviceName: this.request.serviceName,
                requestType: this.request.requestType,
                data: { id: this.$route.params.id, body: this.formData },
            });

            if (response) {
                this.$router.push('/time');
            }
        },
        back() {
            this.$router.push('/time');
        },
    },
};

</script>
