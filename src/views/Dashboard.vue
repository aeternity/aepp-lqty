<template>
    <v-row>
        <v-col v-if="!walletInfo" cols="12">
            <WalletConnectCard />
        </v-col>
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
        <v-col cols="12" md="4">
            <NetWorthCard />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import WalletConnectCard from "@/components/WalletConnect/WalletConnectCard.vue";
import NetWorthCard from "@/components/Cards/NetWorthCard.vue";
import BorrowedTokensCard from "@/components/Cards/BorrowedTokensCard.vue";
import SuppliedTokensCard from "@/components/Cards/SuppliedTokensCard.vue";

import { useWalletConnect } from "@/store/walletConnect";
import { storeToRefs } from "pinia";

export default {
    components: {
        NetWorthCard,
        WalletConnectCard,
        BorrowedTokensCard,
        SuppliedTokensCard,
    },
    setup() {
        const { walletInfo } = storeToRefs(useWalletConnect());

        return {
            walletInfo,
        };
    },
};
</script>
