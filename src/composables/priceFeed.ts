import { Decimal } from "@liquity/lib-base";
import { ref } from "vue";

import { useAeppSdk } from "./aeppSdk";

const priceFeed = ref<Decimal>(Decimal.ZERO);
const priceFeedLoading = ref(false);

export function usePriceFeed() {
  const { contracts } = useAeppSdk();

  async function loadPriceFeed() {
    priceFeedLoading.value = true;
    priceFeed.value = Decimal.fromBigNumberString(
      (await contracts.PriceFeedTestnet.methods.get_price()).decodedResult
    );
    priceFeedLoading.value = false;
  }

  async function updatePriceFeed(price: Decimal) {
    priceFeedLoading.value = true;
    await contracts.PriceFeedTestnet.methods.set_price(price.bigNumber);
    await loadPriceFeed();
  }

  return {
    loadPriceFeed,
    updatePriceFeed,
    priceFeed,
    priceFeedLoading,
  };
}
