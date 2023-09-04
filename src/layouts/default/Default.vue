<template>
    <v-app :theme="darkMode ? 'dark' : 'light'">
        <default-bar v-if="!IS_FRAMED_AEPP"/>
        <left-side-bar />

        <default-view />
        <v-bottom-navigation grow v-if="smAndDown">
            <v-btn :to="{ name: 'dashboard' }" exact>
                <v-icon>mdi-home</v-icon>

                <span>Home</span>
            </v-btn>
            <v-btn :to="{ name: 'borrow' }">
                <v-icon>mdi-cash</v-icon>

                <span>Borrow</span>
            </v-btn>

            <v-btn :to="{ name: 'stability-pool' }">
                <v-icon>mdi-wallet</v-icon>

                <span>Lend</span>
            </v-btn>

            <v-btn :to="{ name: 'invest' }">
                <v-icon>mdi-piggy-bank</v-icon>

                <span>Stake</span>
            </v-btn>

            <v-btn :to="{ name: 'settings' }">
                <v-icon>mdi-menu</v-icon>

                <span>More</span>
            </v-btn>
        </v-bottom-navigation>
    </v-app>
</template>

<script lang="ts">
import { useAppStore } from "@/store/app";
import DefaultBar from "./AppBar.vue";
import LeftSideBar from "./LeftSideBar.vue";
import DefaultView from "./View.vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { IS_FRAMED_AEPP } from "@/utils/constants";

export default {
    components: {
        DefaultBar,
        LeftSideBar,
        DefaultView,
    },
    setup() {
        const { darkMode } = storeToRefs(useAppStore());
        const { smAndDown } = useDisplay();

        return {
            darkMode,

            smAndDown,
            IS_FRAMED_AEPP,
        };
    },
};
</script>
