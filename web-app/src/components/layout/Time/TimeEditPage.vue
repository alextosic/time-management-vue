<template>
    <v-container class="time-edit-page" fluid v-show="!!time.id">
        <v-row>
            <h1 class="display-2 pa-4">Edit Time</h1>
        </v-row>
        <v-row align="center" justify="center" class="mt-12">
            <v-col cols="6">
                <TimeModify page="update" :existingData="time"></TimeModify>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import TimeModify from '../../Time/TimeModifyComponent.vue';

export default {
    components: {
        TimeModify,
    },
    data() {
        return {
            time: {},
        };
    },
    async mounted() {
        await this.getTime();
    },
    methods: {
        async getTime() {
            const time = await this.$store.dispatch('api/request', {
                serviceName: 'time',
                requestType: 'details',
                data: { id: this.$route.params.id },
                hideMessage: true,
            });

            if (time) {
                this.time = Object.assign({}, time);
            } else {
                this.$router.push('/time');
            }
        },
    },
};

</script>
