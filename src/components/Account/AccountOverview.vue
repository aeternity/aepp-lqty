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
import { usePriceFeed } from "@/composables/priceFeed";
import { useStableToken } from "@/composables/stableToken";
import { AEUSD_TOKEN } from "@/utils";
import AccountTotalBalanceCard from "./Cards/AccountTotalBalanceCard.vue";
import AccountTotalBorrowedTokensCard from "./Cards/AccountTotalBorrowedTokensCard.vue";
import AccountTotalSuppliedTokensCard from "./Cards/AccountTotalSuppliedTokensCard.vue";

export default {
    components: {
        AccountTotalBalanceCard,
        AccountTotalBorrowedTokensCard,
        AccountTotalSuppliedTokensCard,
    },
    setup() {
        const { activeAccountStableTokenBalance } = useStableToken();
        const { priceFeed } = usePriceFeed();

        return {
            activeAccountStableTokenBalance,
            AEUSD_TOKEN,
            priceFeed,
        };
    },
};
</script>
