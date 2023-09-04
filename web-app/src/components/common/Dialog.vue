<template>
    <v-dialog v-model="open" width="500">
        <template v-slot:activator="{ on }">
            <v-btn depressed fab x-small :color="color" v-on="on">
                <slot></slot>
            </v-btn>
        </template>

        <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>{{ title }}</v-card-title>
            <v-card-text class="mt-4">{{ text }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed color="success" @click="clickedYes">Yes</v-btn>
                <v-btn depressed color="error" @click="clickedNo">No</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    props: {
        title: {
            type: String,
        },
        text: {
            type: String,
        },
        color: {
            type: String,
        },
    },
    data() {
        return {
            open: false,
        };
    },
    methods: {
        clickedYes() {
            this.open = false;
            this.$emit('yes');
        },
        clickedNo() {
            this.open = false;
        },
    },
};

</script>
