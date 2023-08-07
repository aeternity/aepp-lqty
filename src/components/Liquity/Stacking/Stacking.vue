<template>
    <v-row class="pt-4">
        <v-col md="6">
            <v-card>
                <v-card-text class="d-flex align-center">
                    <div class="d-flex align-center">
                        <v-avatar start>
                            <v-img
                                :src="`https://avatars.z52da5wt.xyz/${AEUSD_TOKEN.contractId}`"
                                class="token-icon"
                            />
                        </v-avatar>
                        <div class="text-h6 pl-4">
                            {{ Decimal.from(0).prettify(2) }}
                            {{ AEUSD_TOKEN.symbol }} (under dev)
                        </div>
                    </div>
                    <v-spacer />
                    <v-chip small color="green">Supplied</v-chip>
                </v-card-text>
                <v-divider />
                <v-card-text>
                    <div class="d-flex justify-space-between pb-2">
                        <strong>Rewards</strong>
                        <div>
                            {{ Decimal.from(0).prettify(2) }}
                            {{ AEUSD_TOKEN.symbol }}
                        </div>
                    </div>
                    <div class="d-flex justify-space-between pb-2">
                        <strong>Liquidation gain</strong>
                        <div>
                            {{ Decimal.from(0).prettify(2) }}
                            AE
                        </div>
                    </div>
                    <v-btn variant="outlined" color="primary" block>
                        Claim LQTY and AE
                    </v-btn>
                    <v-btn variant="outlined" color="primary" class="mt-4" block>
                        Claim LQTY and move ETH to Trove
                    </v-btn>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <v-btn> Supply </v-btn>
                    <v-spacer />
                    <v-btn> Withdraw </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { useTokens } from '@/store/tokens';
import { Decimal } from "@liquity/lib-base";
import { storeToRefs } from 'pinia';

export default {
    name: "StabilityPool",
    components: {},
    setup() {
      const { AEUSD_TOKEN } = storeToRefs(useTokens());


        return {
            Decimal,
            AEUSD_TOKEN,
        };
    },
};
</script>

<style scoped>
.token-icon {
    width: 40px;
}
</style>
