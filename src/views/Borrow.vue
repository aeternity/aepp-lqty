<template>
    <div>
        <v-row>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title> 0.50% </v-card-title>
                    <v-card-text> Borrow Fee </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title> 0.50% </v-card-title>
                    <v-card-text> Borrow Fee </v-card-text>
                </v-card>
            </v-col>

            <v-col md="6">
                <v-card>
                    <v-card-title> TODO </v-card-title>
                    <v-card-text> D / C (%) </v-card-text>
                </v-card>
            </v-col>

            <v-col md="6">
                <v-card>
                    <v-card-title> TODO </v-card-title>
                    <v-card-text> Liquidation (AE) </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <TroveManager />
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import TroveManager from "@/components/TroveManager/TroveManager.vue";
import { useTroveManager } from "@/composables/troveManager";
import { storeToRefs } from "pinia";
import { useAccounts } from "@/store/accounts";
import { watch } from "vue";

export default {
    components: {
        TroveManager,
    },
    setup() {
        const { loadActiveTrove, activeTrove } = useTroveManager();
        const { activeAccount } = storeToRefs(useAccounts());

        watch(
            () => activeAccount,
            async () => {
                console.info("========================");
                console.info("activeAccount ::", activeAccount);
                console.info("========================");

                await loadActiveTrove();
            },
            { immediate: true }
        );
        return {
            activeTrove,
            activeAccount,
        };
    },
};
</script>
