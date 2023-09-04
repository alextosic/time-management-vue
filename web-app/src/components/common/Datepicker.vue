<template>
    <div class="date-picker">
        <v-menu
            ref="datepicker"
            v-model="open"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="date"
            transition="scale-transition"
            min-width="290px"
            offset-y
        >
            <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="date"
                    :label="label"
                    :prepend-icon="!noIcon ? `mdi-calendar` : ''"
                    readonly
                    v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker
                v-model="date"
                no-title
                scrollable
            >
                <div class="flex-grow-1"></div>
                <v-btn
                    text
                    color="primary"
                    @click="open = false"
                >
                    Cancel
                </v-btn>
                <v-btn
                    text
                    color="primary"
                    @click="dateSelected"
                >
                    OK
                </v-btn>
            </v-date-picker>
        </v-menu>
    </div>
</template>

<script>

export default {
    props: {
        label: {
            type: String,
            default: 'Date',
        },
        value: {
            type: String,
        },
        noIcon: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            open: false,
            date: null,
        };
    },
    watch: {
        value() {
            this.updateDate();
        },
    },
    mounted() {
        this.updateDate();
    },
    methods: {
        updateDate() {
            this.date = this.value;
        },
        dateSelected() {
            this.$refs.datepicker.save(this.date);
            this.$emit('input', this.date);
        },
    },
};

</script>
