<template>
    <v-app>
        <default-bar />
        <left-side-bar />

        <default-view />
    </v-app>
</template>

<script lang="ts">
import DefaultBar from "./AppBar.vue";
import LeftSideBar from "./LeftSideBar.vue";
import DefaultView from "./View.vue";

export default {
    components: {
        DefaultBar,
        LeftSideBar,
        DefaultView,
    },
};
</script>
