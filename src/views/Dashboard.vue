<template>
    <v-row>
        <v-col>
            <SystemStatsCard />
        </v-col>
        <v-col cols="12">
            <AccountOverview />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import AccountOverview from "@/components/Account/AccountOverview.vue";
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";

export default {
    components: {
        AccountOverview,
        SystemStatsCard,
    },
};
</script>
