<template>
    <v-row>
        <v-col cols="12" md="12">
            <SystemStatsCard :show-protocol-stats="false" />
        </v-col>
        <v-col>
            <StabilityPoolCard />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";

import StabilityPoolCard from "@/components/StabilityPool/StabilityPoolCard.vue";

export default {
    components: {
        SystemStatsCard,
        StabilityPoolCard,
    },
    setup() {


        return {};
    },
};
</script>
