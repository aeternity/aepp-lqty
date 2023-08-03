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
import { useTroveManager } from "@/composables/troveManager";
import { AEUSD_TOKEN } from "@/utils";
import { Decimal } from "@liquity/lib-base";
import { computed } from "vue";

export default {
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
