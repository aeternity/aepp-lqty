<template>
    <v-navigation-drawer color="surface" :model-value="leftSideBar">
        <div style="height: 80%">
            <v-list class="flex-1">
                <v-list-item :to="{ name: 'dashboard' }" exact>
                    <template v-slot:prepend>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </template>
                    <v-list-item-title> Dashboard </v-list-item-title>
                </v-list-item>

                <v-list-item :to="{ name: 'borrow' }">
                    <template v-slot:prepend>
                        <v-icon>mdi-bank-transfer-in</v-icon>
                    </template>
                    <v-list-item-title> Borrow </v-list-item-title>
                </v-list-item>

                <v-list-item :to="{ name: 'invest' }">
                    <template v-slot:prepend>
                        <v-icon>mdi-bank-transfer</v-icon>
                    </template>
                    <v-list-item-title> Stake </v-list-item-title>
                </v-list-item>

                <v-list-item :to="{ name: 'stability-pool' }">
                    <template v-slot:prepend>
                        <v-icon>mdi-bank-transfer</v-icon>
                    </template>
                    <v-list-item-title> Stability Pool </v-list-item-title>
                </v-list-item>

                <v-list-item :to="{ name: 'markets' }">
                    <template v-slot:prepend>
                        <v-icon>mdi-bank-transfer</v-icon>
                    </template>
                    <v-list-item-title> Markets </v-list-item-title>
                </v-list-item>

                <v-list-item :to="{ name: 'troves' }">
                    <template v-slot:prepend>
                        <v-icon>mdi-list-box</v-icon>
                    </template>
                    <v-list-item-title> Active Troves </v-list-item-title>
                </v-list-item>

                <v-list-item :to="{ name: 'settings' }">
                    <template v-slot:prepend>
                        <v-icon>mdi-cog</v-icon>
                    </template>
                    <v-list-item-title> Settings </v-list-item-title>
                </v-list-item>
            </v-list>
        </div>
        <div class="pa-2">
            <v-btn @click="toggleDarkMode()" variant="text" block>
                <v-icon>mdi-theme-light-dark</v-icon>
                <span class="pl-4"
                    >Switch to {{ darkMode ? "light" : "dark" }}</span
                >
            </v-btn>
        </div>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";

export default {
    setup() {
        const { darkMode, leftSideBar } = storeToRefs(useAppStore());
        const { toggleDarkMode } = useAppStore();

        return {
            darkMode,
            toggleDarkMode,
            leftSideBar,
        };
    },
};
</script>
