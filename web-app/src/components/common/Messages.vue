<template>
    <v-container class="messages fill-height" fluid>
        <v-alert
            v-for="(message, index) in messages"
            :key="index"
            :color="message.type"
        >
            {{ message.text }}
        </v-alert>
    </v-container>
</template>

<script>

export default {
    computed: {
        messages() {
            return this.$store.getters['messages/getList'];
        },
    },
};

</script>

<style type="text/scss" lang="scss">
    @import '../../styles/common/Messages.scss';
</style>
