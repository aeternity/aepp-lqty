<template>
    <v-row>
        <v-col cols="12">
            <h2>Overview</h2>
        </v-col>
        <v-col cols="12" md="4">
            <NetWorthCard />
        </v-col>
        <v-col cols="12" md="4">
            <SuppliedTokensCard />
        </v-col>
        <v-col cols="12" md="4">
            <BorrowedTokensCard />
        </v-col>
        <v-col cols="12">
            <h2>DeFi Assets</h2>
        </v-col>
        <v-col v-for="(token, index) in ASSETS" :key="index" cols="12" md="4">
            <TokenPositionCard :token="token" />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import BorrowedTokensCard from "@/components/Cards/BorrowedTokensCard.vue";
import NetWorthCard from "@/components/Cards/NetWorthCard.vue";
import SuppliedTokensCard from "@/components/Cards/SuppliedTokensCard.vue";
import TokenPositionCard from "@/components/Cards/TokenPositionCard.vue";
import { ASSETS } from "@/utils";

export default {
    components: {
        NetWorthCard,
        BorrowedTokensCard,
        SuppliedTokensCard,
        TokenPositionCard,
    },
    setup() {
        return {
            ASSETS,
        };
    },
};
</script>
