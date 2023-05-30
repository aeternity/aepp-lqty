import { ref } from "vue";
import useAeSdk from "./aeSdk";
import { useLqty } from "./lqty";

const loadingPriceFeed = ref(false);
const priceFeed = ref(0);

export function usePriceFeed() {
  const { contracts } = useLqty();
  const { contractByteArrayEncoder } = useAeSdk();

  async function loadPriceFeed() {
    loadingPriceFeed.value = true;
    const get_price = await contracts.PriceFeedTestnet.methods.get_price();
    priceFeed.value = contractByteArrayEncoder.decode(
      get_price.result.returnValue
    );
    console.log("priceFeed ::", priceFeed.value);

    loadingPriceFeed.value = false;
  }

  return {
    loadPriceFeed,

    priceFeed,
    loadingPriceFeed,
  };
}
