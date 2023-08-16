import { useAeppSdk } from "@/composables";
import { Decimal } from "@liquity/lib-base";

import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePriceFeed = defineStore(
  "priceFeed",
  () => {
    const { contracts, onAccount } = useAeppSdk();

    const _priceFeed = ref();
    const priceFeed = computed<Decimal>(() =>
      _priceFeed.value
        ? Decimal.fromBigNumberString(_priceFeed.value)
        : Decimal.ZERO
    );

    async function loadPriceFeed() {
      _priceFeed.value = (
        await contracts.PriceFeedTestnet.methods.get_price()
      ).decodedResult;
    }

    async function updatePriceFeed(price: Decimal) {
      try {
        await contracts.PriceFeedTestnet.methods.set_price(price.bigNumber, {
          onAccount: onAccount(),
        });
      } catch (error) {
        //
      }
      await loadPriceFeed();
    }

    return {
      priceFeed,

      updatePriceFeed,
      loadPriceFeed,
    };
  },
  { persist: true }
);
