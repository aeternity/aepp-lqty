<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-space-between align-center">
            <div>
                <AmountFormatter class="pa-4" :amount="totalSupplied" />

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
import AmountFormatter from "@/components/Common/AmountFormatter.vue";

export default {
    components: { AmountFormatter },
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
