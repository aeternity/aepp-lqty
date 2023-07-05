<template>
    <v-row>
        <v-col cols="12">
            <h2 class="py-2">Overview</h2>
            <v-alert type="warning">
                <strong>Note :</strong> <br />
                1 AE = {{ priceFeed.prettify(2) }} AEUSD
            </v-alert>
        </v-col>


        <v-col cols="12" md="6">
            <v-card>
                <v-card-title> 0.50% </v-card-title>
                <v-card-text> Borrow Fee </v-card-text>
            </v-card>
        </v-col>

        <v-col md="6">
            <v-card>
                <v-card-title> TODO </v-card-title>
                <v-card-text> D / C (%) </v-card-text>
            </v-card>
        </v-col>

        <v-col md="6">
            <v-card>
                <v-card-title> TODO </v-card-title>
                <v-card-text> Liquidation (AE) </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { useStableToken } from "@/composables/stableToken";
import { AEUSD_TOKEN } from "@/utils";
import { usePriceFeed } from "@/composables/priceFeed";
// import TransferStableToken from "./Exchange/TransferStableToken.vue";

export default {
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
