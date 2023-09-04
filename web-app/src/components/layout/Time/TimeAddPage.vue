<template>
    <v-container class="time-add-page" fluid>
        <v-row>
            <h1 class="display-2 pa-4">Add Time</h1>
        </v-row>
        <v-row align="center" justify="center" class="mt-12">
            <v-col cols="6">
                <TimeModify page="create"></TimeModify>
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
};

</script>
