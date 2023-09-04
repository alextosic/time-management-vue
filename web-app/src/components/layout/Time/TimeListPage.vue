<template>
    <v-container class="time-list" fluid>
        <v-row>
            <h1 class="display-2 pa-4">Times</h1>
        </v-row>
        <v-row>
            <v-col cols="12" class="d-flex flex-row-reverse">
                <v-btn depressed color="success" to="/time/add">Add time entry</v-btn>
                <v-btn depressed color="error" class="mr-4" @click="exportTimeList">Export list</v-btn>
                <a class="hidden" ref="download"></a>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4" lg="2" class="py-6">
                <Filters v-model="dates" @input="getTimeList"></Filters>
            </v-col>
            <v-col cols="8" lg="10">
                <v-data-iterator :items="timeList" hide-default-footer disable-pagination>
                    <template v-slot:default="props">
                        <v-row>
                            <v-col v-for="(item, index) in props.items" :key="index" cols="12" md="6" lg="3">
                                <v-card height="380" class="d-flex flex-column">
                                    <v-card-title><h4>{{ item.text }}</h4></v-card-title>
                                    <TimeListItem :item="item" @deleted="timeDeleted"></TimeListItem>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>
                </v-data-iterator>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import moment from 'moment';
import _ from 'lodash';

import TimeListItem from '../../Time/TimeListItemComponent.vue';
import Filters from '../../common/Filters.vue';
import appConstants from '../../../constants/app';

export default {
    components: {
        TimeListItem,
        Filters,
    },
    data() {
        return {
            timeList: [],
            dates: {
                from: moment().startOf('month').format('YYYY-MM-DD'),
                to: moment().format('YYYY-MM-DD'),
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
        requestType() {
            return this.isAdmin ? 'list' : 'listPerUser';
        },
    },
    async mounted() {
        await this.getTimeList();
    },
    methods: {
        getDays() {
            const list = [];

            for (let day = moment(this.dates.from); day.diff(this.dates.to, 'days') <= 0; day.add(1, 'days')) {
                list.push({
                    text: day.format('DD MMM YYYY'),
                    value: day.format('YYYY-MM-DD'),
                });
            }

            return list;
        },
        async getTimeList() {
            const response = await this.$store.dispatch('api/request', {
                serviceName: 'time',
                requestType: this.requestType,
                data: { query: this.dates },
                hideMessage: true,
            });

            const days = this.getDays();
            const groupedTimes = _.groupBy(response, 'date');

            Object.keys(groupedTimes).forEach((timeKey) => {
                const foundDay = days.find(day => day.value === timeKey);

                if (foundDay) {
                    foundDay.times = _.groupBy(groupedTimes[timeKey], 'userId');
                }
            });

            this.timeList = days;
        },
        async exportTimeList() {
            const response = await this.$store.dispatch('api/request', {
                serviceName: 'time',
                requestType: this.isAdmin ? 'export' : 'exportPerUser',
                hideMessage: true,
            });

            this.$refs.download.href = response.file;
            this.$refs.download.download = response.name;
            this.$refs.download.click();
        },
        async timeDeleted() {
            await this.getTimeList();
        },
    },
};

</script>
