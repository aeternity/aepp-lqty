<template>
    <v-navigation-drawer color="surface">
        <div style="height: 80%">
            <v-list class="flex-1">
                <v-list-item :to="{ name: 'dashboard' }" exact>
                    <template v-slot:prepend>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </template>
                    <v-list-item-title> Dashboard </v-list-item-title>
                </v-list-item>
                <v-list-item :to="{ name: 'liquity' }">
                    <template v-slot:prepend>
                        <v-icon>mdi-bank</v-icon>
                    </template>
                    <v-list-item-title> Liquity </v-list-item-title>
                </v-list-item>

                <v-list-item :to="{ name: 'oracles' }">
                    <template v-slot:prepend>
                        <v-icon>mdi-bank</v-icon>
                    </template>
                    <v-list-item-title> Oracles </v-list-item-title>
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
        const { darkMode } = storeToRefs(useAppStore());
        const { toggleDarkMode } = useAppStore();

        return {
            darkMode,
            toggleDarkMode,
        };
    },
};
</script>
