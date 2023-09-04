<template>
    <v-container class="time-list" fluid>
        <v-row>
            <h1 class="display-2 pa-4">Users</h1>
        </v-row>
        <v-row>
            <v-col cols="12" class="d-flex flex-row-reverse">
                <v-btn depressed color="success" to="/user/add">Add user</v-btn>
                <v-btn depressed color="error" class="mr-4" @click="exportUserList">Export list</v-btn>
                <a class="hidden" ref="download"></a>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table class="elevation-1" :headers="headers" :items="userList"
                    :items-per-page.sync="pagination.pageSize" :page.sync="pagination.page"
                    :server-items-length="pagination.total"
                >
                    <template v-slot:item.role="{ item }">
                        {{ formatUserRole(item.role) }}
                    </template>
                    <template v-slot:item.createdAt="{ item }">
                        {{ formatDate(item.createdAt) }}
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn x-small fab depressed class="mr-2" color="warning" :to="`/user/${item.id}`" >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <Dialog color="error" :title="dialog.title" :text="dialog.text" @yes="deleteUser(item.id)">
                            <v-icon>mdi-delete</v-icon>
                        </Dialog>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import moment from 'moment';

import Dialog from '../../common/Dialog.vue';
import appConstants from '../../../constants/app';

export default {
    components: {
        Dialog,
    },
    data() {
        return {
            dialog: {
                title: 'Delete user',
                text: 'Are you sure you want to delete this user?',
            },
            pagination: {
                page: 1,
                pageSize: 5,
                total: 0,
            },
            headers: [
                {
                    text: 'Id',
                    value: 'id',
                },
                {
                    text: 'First name',
                    value: 'firstName',
                },
                {
                    text: 'Last name',
                    value: 'lastName',
                },
                {
                    text: 'Email',
                    value: 'email',
                },
                {
                    text: 'Role',
                    value: 'role',
                },
                {
                    text: 'Preferred working hours',
                    value: 'preferredWorkingHours',
                },
                {
                    text: 'Date created',
                    value: 'createdAt',
                },
                {
                    text: 'Actions',
                    value: 'actions',
                },
            ],
            userList: [],
        };
    },
    watch: {
        'pagination.page': {
            handler() {
                this.getUserList();
            },
        },
        'pagination.pageSize': {
            handler() {
                this.getUserList();
            },
        },
    },
    mounted() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const response = await this.$store.dispatch('api/request', {
                serviceName: 'user',
                requestType: 'list',
                data: {
                    query: {
                        page: this.pagination.pageSize !== -1 ? this.pagination.page : null,
                        pageSize: this.pagination.pageSize !== -1 ? this.pagination.pageSize : null,
                    },
                },
                hideMessage: true,
            });

            if (response) {
                this.userList = response.list;
                this.pagination.total = response.count;
            }
        },
        async exportUserList() {
            const response = await this.$store.dispatch('api/request', {
                serviceName: 'user',
                requestType: 'export',
                hideMessage: true,
            });

            this.$refs.download.href = response.file;
            this.$refs.download.download = response.name;
            this.$refs.download.click();
        },
        async deleteUser(id) {
            const response = await this.$store.dispatch('api/request', {
                serviceName: 'user',
                requestType: 'delete',
                data: { id },
            });

            if (response) {
                await this.getUserList();
            }
        },
        formatUserRole(role) {
            return Object.keys(appConstants.user.roles).find(roleName => appConstants.user.roles[roleName] === role);
        },
        formatDate(date) {
            return moment(date).format('DD MMM YYYY [at] HH:mm:ss');
        },
    },
};

</script>
