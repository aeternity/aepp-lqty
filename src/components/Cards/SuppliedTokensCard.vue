<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-space-between align-center">
            <div>
                <v-card-title class="text-h5">
                    {{ balance.prettify(2) }} AE
                </v-card-title>

                <v-card-text> Supplied </v-card-text>
            </div>

            <v-avatar class="ma-3" rounded="0">
                <v-icon size="40">mdi-cash</v-icon>
            </v-avatar>
        </div>
    </v-card>
</template>

<script lang="ts">
import { useBalances } from "@/store/balances";
import { storeToRefs } from "pinia";

export default {
    setup() {
        const { balance } = storeToRefs(useBalances());

        return {
            balance,
        };
    },
};
</script>
