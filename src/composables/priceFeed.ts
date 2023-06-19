import { Decimal } from "@liquity/lib-base";
import { ref } from "vue";

import { useAeppSdk } from "./aeppSdk";

const priceFeed = ref<Decimal>(Decimal.ZERO);

export function usePriceFeed() {
  const { contracts } = useAeppSdk();

  async function loadPriceFeed() {
    priceFeed.value = Decimal.fromBigNumberString(
      (await contracts.PriceFeedTestnet.methods.get_price()).decodedResult
    );
  }

  return {
    loadPriceFeed,

    priceFeed,
  };
}
