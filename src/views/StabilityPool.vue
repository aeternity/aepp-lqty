<template>
    <v-row>
        <v-col cols="12" md="12">
            <SystemStatsCard :show-protocol-stats="false" />
        </v-col>
        <!-- <v-col cols="12" md="6">
            <ProvideTokensToStabilityPool />
        </v-col>
        <v-col cols="12" md="6">
            <WithdrawTokensFromStabilityPool />
        </v-col> -->
        <v-col>
            <StabilityPoolPositionManager />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";

import ProvideTokensToStabilityPool from "@/components/StabilityPool/ProvideTokensToStabilityPool.vue";
import StabilityPoolPositionManager from "@/components/StabilityPool/StabilityPoolPositionManager.vue";
import WithdrawTokensFromStabilityPool from "@/components/StabilityPool/WithdrawTokensFromStabilityPool.vue";

export default {
    components: {
        SystemStatsCard,
        ProvideTokensToStabilityPool,
        WithdrawTokensFromStabilityPool,
        StabilityPoolPositionManager,
    },
    setup() {


        return {};
    },
};
</script>
