<template>
    <v-row>
        <v-col cols="12" md="12">
            <SystemStatsCard />
        </v-col>
        <v-col cols="12">
            <LQTYStakingCard />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";
import LQTYStakingCard from "@/components/Staking/LQTYStakingCard.vue";

export default {
    components: { LQTYStakingCard, SystemStatsCard },
};
</script>
