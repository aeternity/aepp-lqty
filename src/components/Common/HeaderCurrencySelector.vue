<template>
    <div>
        <v-menu max-height="400px">
            <template v-slot:activator="{ props }">
                <v-chip v-bind="props">
                    <span class="text-uppercase">{{
                        currentCurrencyCode
                    }}</span>
                    <v-icon>mdi-chevron-down</v-icon>
                </v-chip>
            </template>
            <v-list>
                <template v-for="currency in CURRENCIES" :key="currency">
                    <v-list-item
                        v-if="currentCurrencyCode !== currency.code"
                        :value="currency"
                        @click="setCurrentCurrency(currency.code)"
                    >
                        <v-list-item-title>
                            {{ currency.name }}
                        </v-list-item-title>
                    </v-list-item>
                </template>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import { useCurrencies } from "@/store/currencies";
import { CURRENCIES } from "@/utils/constants";
import { storeToRefs } from "pinia";

export default {
    setup() {
        const { currentCurrencyCode } = storeToRefs(useCurrencies());
        const { setCurrentCurrency } = useCurrencies();
        return {
            currentCurrencyCode,
            setCurrentCurrency,
            CURRENCIES,
        };
    },
};
</script>
