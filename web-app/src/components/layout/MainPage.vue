<template>
    <div class="main-page">
        <Header></Header>
        <div class="content mt-12">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

import Header from '../common/Header.vue';

export default {
    components: {
        Header,
    },
};

</script>
