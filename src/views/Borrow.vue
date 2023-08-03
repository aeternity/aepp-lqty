<template>
    <v-row>
        <v-col cols="12">
            <AccountOverview />
        </v-col>
        <v-col cols="12">
            <TroveManager />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import TroveManager from "@/components/TroveManager/TroveManager.vue";
import { useTroveManager } from "@/composables/troveManager";
import { storeToRefs } from "pinia";
import { useAccounts } from "@/store/accounts";
import { watch } from "vue";
import AccountOverview from "@/components/Account/AccountOverview.vue";

export default {
    components: {
        TroveManager,
        AccountOverview,
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
