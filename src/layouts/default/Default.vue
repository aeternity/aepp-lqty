<template>
    <v-app :theme="darkMode ? 'dark' : 'light'">
        <default-bar />
        <left-side-bar />

        <default-view />
    </v-app>
</template>

<script lang="ts">
import { useAppStore } from "@/store/app";
import DefaultBar from "./AppBar.vue";
import LeftSideBar from "./LeftSideBar.vue";
import DefaultView from "./View.vue";
import { storeToRefs } from 'pinia';

export default {
    components: {
        DefaultBar,
        LeftSideBar,
        DefaultView,
    },
    setup() {
        const { darkMode } = storeToRefs(useAppStore());

        return {
            darkMode,
        };
    },
};
</script>
