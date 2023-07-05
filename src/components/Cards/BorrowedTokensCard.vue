<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-space-between align-center">
            <div>
                <v-card-title class="text-h5">
                    {{ totalBorrowed.prettify(2) }} {{ AEUSD_TOKEN.symbol }}
                </v-card-title>

                <v-card-text> Borrowed </v-card-text>
            </div>

            <v-avatar class="ma-3" rounded="0">
                <v-icon size="40">mdi-cash-plus</v-icon>
            </v-avatar>
        </div>
    </v-card>
</template>

<script lang="ts">
import { useBalances } from "@/store/balances";
import { storeToRefs } from "pinia";
import { useTroveManager } from "@/composables/troveManager";
import { Decimal } from "@liquity/lib-base";
import { computed } from "vue";
import { AEUSD_TOKEN } from "@/utils";

export default {
    setup() {
        const { activeTrove } = useTroveManager();

        const { balance } = storeToRefs(useBalances());

        const totalBorrowed = computed<Decimal>(() => {
            return Decimal.fromBigNumberString(activeTrove.value?.debt || 0);
        });

        return {
            balance,
            totalBorrowed,
            AEUSD_TOKEN,
        };
    },
};
</script>
