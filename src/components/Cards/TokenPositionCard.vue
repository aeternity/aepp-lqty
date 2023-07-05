<template>
    <v-card>
        <v-card-text class="d-flex">
            <div class="d-flex align-center">
                <v-avatar start>
                    <v-img
                        :src="`https://avatars.z52da5wt.xyz/${token.contractAddress}`"
                        class="token-icon"
                    />
                </v-avatar>
                <div class="text-h6 pl-4">
                    {{ balance.prettify(2) }} {{ token.symbol }}
                </div>
            </div>
            <v-spacer />
            <v-btn color="primary" size="small" disabled> Manage </v-btn>
        </v-card-text>
        <v-divider />
        <v-card-text class="d-flex justify-space-around">
            <div class="text-center">
                <span class="text-subtitle-1">0.00%</span>
                <br />
                <small>Status (D/C)%</small>
            </div>
            <v-divider vertical />
            <div class="text-center">
                <v-chip> No position </v-chip>
                <br />
                <small>Max -0.00%</small>
            </div>
        </v-card-text>
        <v-divider />
        <v-card-text class="text-center"> No position </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { useBalances } from "@/store/balances";
import { storeToRefs } from "pinia";
import { Decimal } from "@liquity/lib-base";
import { computed } from "vue";

export default {
    props: {
        token: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const balance = computed<Decimal>(() => {
            return Decimal.from(0);
        });

        return {
            balance,
        };
    },
};
</script>
