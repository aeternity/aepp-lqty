<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-space-between align-center">
            <div>
                <AmountFormatter
                  class="pa-4"
                  :amount="totalBorrowed"
                  :token="AEUSD_TOKEN"
                />

                <v-card-text> Borrowed </v-card-text>
            </div>

            <v-avatar class="ma-3" rounded="0">
                <v-icon size="40">mdi-cash-plus</v-icon>
            </v-avatar>
        </div>
    </v-card>
</template>

<script lang="ts">
import { useTroveManager } from "@/composables/troveManager";
import { AEUSD_TOKEN } from "@/utils";
import { Decimal } from "@liquity/lib-base";
import { computed } from "vue";
import AmountFormatter from '@/components/Common/AmountFormatter.vue';

export default {
    components: { AmountFormatter },
    setup() {
        const { activeTrove } = useTroveManager();

        const totalBorrowed = computed<Decimal>(() => {
            return Decimal.fromBigNumberString(activeTrove.value?.debt || 0);
        });

        return {
            totalBorrowed,
            AEUSD_TOKEN,
        };
    },
};
</script>
