<template>
    <v-row>
        <v-col>
            <SystemStatsCard />
        </v-col>
        <v-col cols="12">
            <AccountOverview />
        </v-col>

        <v-col cols="12">
            <h2>Assets</h2>
        </v-col>
        <v-col v-for="(token, index) in ASSETS" :key="index" cols="12" md="4">
            <TokenPositionCard :token="token" />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import AccountOverview from "@/components/Account/AccountOverview.vue";
import TokenPositionCard from "@/components/Account/Cards/TokenPositionCard.vue";
import { ASSETS } from "@/utils";
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";

export default {
    components: {
        TokenPositionCard,
        AccountOverview,
        SystemStatsCard,
    },
    setup() {
        return {
            ASSETS,
        };
    },
};
</script>
