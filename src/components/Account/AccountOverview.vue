<template>
    <v-row>
        <v-col cols="12">
            <h2 class="py-2">Account Overview</h2>
            <v-alert type="warning">
                <strong>Note :</strong>
                The current price feed are not accurate and are only for testing
                purposes. you can also change it from settings.
                <br />
                1 AE = {{ priceFeed.prettify(2) }} AEUSD
            </v-alert>
        </v-col>

        <v-col cols="12" md="4">
            <AccountTotalBalanceCard />
        </v-col>

        <v-col cols="12" md="4">
            <AccountTotalBorrowedTokensCard />
        </v-col>

        <v-col cols="12" md="4">
            <AccountTotalSuppliedTokensCard />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { useStableToken } from "@/composables/stableToken";
import { useTokens } from "@/store/tokens";
import { storeToRefs } from "pinia";
import AccountTotalBalanceCard from "./Cards/AccountTotalBalanceCard.vue";
import AccountTotalBorrowedTokensCard from "./Cards/AccountTotalBorrowedTokensCard.vue";
import AccountTotalSuppliedTokensCard from "./Cards/AccountTotalSuppliedTokensCard.vue";
import { usePriceFeed } from "@/store/priceFeed";

export default {
    components: {
        AccountTotalBalanceCard,
        AccountTotalBorrowedTokensCard,
        AccountTotalSuppliedTokensCard,
    },
    setup() {
        const { activeAccountStableTokenBalance } = useStableToken();
        const { priceFeed } = storeToRefs(usePriceFeed());
        const { AEUSD_TOKEN } = storeToRefs(useTokens());

        return {
            activeAccountStableTokenBalance,
            AEUSD_TOKEN,
            priceFeed,
        };
    },
};
</script>
