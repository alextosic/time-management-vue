<template>
    <v-card-text class="d-flex flex-column flex-grow-1 overflow-hidden">
        <template v-if="item.times">
            <p class="mb-6">
                <b>Total:</b> {{ getTotalLength(item.times) }} hours
            </p>
            <VueCustomScrollbar class="pl-2 pr-6 pb-4">
                <v-expansion-panels dark accordion v-for="userId in Object.keys(item.times)" :key="userId" class="mt-4">
                    <v-expansion-panel v-for="time in item.times[userId]" :key="time.id"
                        :class="timeEntryColor(time.user, item.times[userId])"
                    >
                        <v-expansion-panel-header class="d-flex">
                            <div v-if="isAdmin" class="mr-2">{{ time.user.firstName }} {{ time.user.lastName }}</div>
                            <v-spacer v-if="isAdmin"></v-spacer>
                            <div class="mr-2 flex-grow-0"><b>{{ time.length }}hrs</b></div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div v-if="time.note">{{ time.note }}</div>
                            <div v-else><i>No note provided.</i></div>
                            <div class="mt-6">
                                <v-btn x-small fab depressed class="mr-2" color="white" :to="`/time/${time.id}`">
                                    <v-icon color="warning">mdi-pencil</v-icon>
                                </v-btn>
                                <Dialog color="white" :title="dialog.title" :text="dialog.text"
                                    @yes="deleteTime(time.id)"
                                >
                                    <v-icon color="error">mdi-delete</v-icon>
                                </Dialog>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </VueCustomScrollbar>
        </template>
        <template v-else>
            <v-row align="center" justify="center">
                <v-col cols="12" class="text-center">
                    <span class="title">No time entries for this day.</span>
                </v-col>
            </v-row>
        </template>
    </v-card-text>
</template>

<script>

import VueCustomScrollbar from 'vue-custom-scrollbar';

import Dialog from '../common/Dialog.vue';
import appConstants from '../../constants/app';

export default {
    components: {
        VueCustomScrollbar,
        Dialog,
    },
    props: {
        item: {
            type: Object,
        },
    },
    data() {
        return {
            dialog: {
                title: 'Delete time',
                text: 'Are you sure you want to delete this time entry?',
            },
        };
    },
    computed: {
        profile() {
            return this.$store.getters['account/getProfile'];
        },
        isAdmin() {
            return parseInt(this.profile.role, 10) <= parseInt(appConstants.user.roles.ADMIN, 10);
        },
    },
    methods: {
        async deleteTime(id) {
            const response = await this.$store.dispatch('api/request', {
                serviceName: 'time',
                requestType: 'delete',
                data: { id },
            });

            if (response) {
                this.$emit('deleted');
            }
        },
        timeEntryColor(user, times) {
            if (!user.preferredWorkingHours) {
                return 'success';
            }

            const combinedTimesLength = times
                .filter(time => time.userId === user.id)
                .reduce((total, time) => total + time.length, 0);

            return combinedTimesLength >= user.preferredWorkingHours ? 'success' : 'error';
        },
        getTotalLength(times) {
            let totalLength = 0;

            Object.keys(times).forEach((userId) => {
                totalLength += times[userId].reduce((total, time) => total + time.length, 0);
            });

            return totalLength;
        },
    },
};

</script>
