
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
                    <TroveManager />
                </v-window-item>
                <v-window-item value="stabilityPool">
                    <StabilityPool />
                </v-window-item>
                <v-window-item value="stacking">
                    <TroveManager />
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { ref } from "vue";
import TroveManager from "@/components/Liquity/Trove/TroveManager.vue";
import StabilityPool from "@/components/Liquity/StabilityPool/StabilityPool.vue";

export default {
    components: {
        TroveManager,
        StabilityPool,
    },
    setup() {
        const activeTab = ref("troveManager");
        return {
            activeTab,
        };
    },
};
</script>
