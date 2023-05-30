
<template>
    <v-row>
        <v-col cols="12">
            <h2>Your Positions</h2>
        </v-col>
        <v-col>
            <v-tabs v-model="activeTab">
                <v-tab value="troveManager">Trove</v-tab>
                <v-tab value="stabilityPool">Stability Pool</v-tab>
                <v-tab value="stacking">Stacking</v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
                <v-window-item value="troveManager">
                    <trove-manager />
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import TroveManager from "./Trove/TroveManager.vue";

const activeTab = ref("troveManager");
</script>
