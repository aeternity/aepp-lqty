import { IToken } from "@/types";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useTokens = defineStore(
  "tokens",
  () => {
    const AEUSD_TOKEN = computed<IToken>(() => ({
      name: "AEUSD",
      symbol: "AEUSD",
      decimals: 17,
      contractId: "ct_21DHaAHUTVYkTDu8WuG6So77SuEd6da9NcuXbsfHg5FH96mB6E",
      conversionRateToAE: 1, // TODO: get from price feed
    }));

    return {
      AEUSD_TOKEN,
    };
  },
  { persist: true }
);
