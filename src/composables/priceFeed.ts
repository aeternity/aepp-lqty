import { ref } from "vue";
import { useLqty } from "./lqty";

const loadingPriceFeed = ref(false);
const priceFeed = ref(0);

export function usePriceFeed() {
  const { contracts } = useLqty();

  async function loadPriceFeed() {
    loadingPriceFeed.value = true;

    priceFeed.value = (
      await contracts.PriceFeedTestnet.methods.get_price()
    ).decodedResult;

    loadingPriceFeed.value = false;
  }

  return {
    loadPriceFeed,

    priceFeed,
    loadingPriceFeed,
  };
}
