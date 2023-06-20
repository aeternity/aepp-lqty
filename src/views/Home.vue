<template>
    <div>
        <div v-if="contractsLoaded && false">
            <AccountOverview />
            <AccountPositions />
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
import AccountPositions from "@/components/AccountPositions.vue";
import { useAeppSdk } from "@/composables";
export default {
    components: {
        AccountOverview,
        AccountPositions,
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
