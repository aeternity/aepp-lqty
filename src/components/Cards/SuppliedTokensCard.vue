<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-space-between align-center">
            <div>
                <v-card-title class="text-h5">
                    {{ totalSupplied.prettify(2) }} AE
                </v-card-title>

                <v-card-text> Supplied </v-card-text>
            </div>

            <v-avatar class="ma-3" rounded="0">
                <v-icon size="40">mdi-cash-off</v-icon>
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

export default {
    setup() {
        const { activeTrove } = useTroveManager();

        const { balance } = storeToRefs(useBalances());

        const totalSupplied = computed<Decimal>(() => {
            return Decimal.fromBigNumberString(activeTrove.value?.coll || 0);
        });

        return {
            balance,
            totalSupplied,
        };
    },
};
</script>
