<template>
    <v-card>
        <div class="d-flex flex-no-wrap justify-space-between align-center">
            <div>
                <AmountFormatter class="pa-4" :amount="balance" />
                <v-card-text> Net Worth </v-card-text>
            </div>

            <v-avatar class="ma-3" rounded="0">
                <v-icon size="40">mdi-cash</v-icon>
            </v-avatar>
        </div>
    </v-card>
</template>

<script lang="ts">
import AmountFormatter from "@/components/Common/AmountFormatter.vue";
import { useBalances } from "@/store/balances";
import { storeToRefs } from "pinia";

export default {
    components: { AmountFormatter },
    setup() {
        const { balance } = storeToRefs(useBalances());

        return {
            balance,
        };
    },
};
</script>
