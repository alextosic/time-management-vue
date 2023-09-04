<template>
    <div class="filters">
        <v-card class="pa-2">
            <v-card-title>Filters</v-card-title>
            <v-card-text class="mt-6">
                <Datepicker label="From" v-model="dates.from"></Datepicker>
                <Datepicker label="To" v-model="dates.to"></Datepicker>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn depressed large color="success" @click="apply">Apply</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>

import Datepicker from './Datepicker.vue';

export default {
    components: {
        Datepicker,
    },
    props: {
        value: {
            type: Object,
        },
    },
    data() {
        return {
            dates: {},
        };
    },
    watch: {
        value() {
            this.updateDates();
        },
    },
    mounted() {
        this.updateDates();
    },
    methods: {
        updateDates() {
            this.dates = Object.assign({}, this.value);
        },
        apply() {
            this.$emit('input', this.dates);
        },
    },
};

</script>
