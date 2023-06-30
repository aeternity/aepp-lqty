<template>
    <div>
        <AccountOverview />
        <div v-if="contractsLoaded">
            <LiquityPositions />
        </div>
        <div v-if="loadingContracts" class="text-center pt-12">
            <v-progress-circular
                indeterminate
                color="primary"
                class="text-center"
                size="40"
            ></v-progress-circular>
        </div>
    </div>
</template>

<script lang="ts">
import AccountOverview from "@/components/AccountOverview.vue";
import LiquityPositions from "@/components/Liquity/LiquityPositions.vue";

import { useAeppSdk } from "@/composables";
export default {
    components: {
        AccountOverview,
        LiquityPositions,
    },
    setup() {
        const { contractsLoaded, loadingContracts } = useAeppSdk();

        return {
            contractsLoaded,
            loadingContracts,
        };
    },
};
</script>
