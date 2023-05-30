import { ref, watch } from "vue";
import useAeSdk from "./aeSdk";
import { useLqty } from "./lqty";

const activeAccountStableTokenBalance = ref(BigInt(0));

export function useStableToken() {
  const { activeAccount, contractByteArrayEncoder } = useAeSdk();
  const { contracts } = useLqty();

  async function getAccountStableTokenBalance(address: string) {
    const get_balance = await contracts.AEUSDToken.methods.balance(address);
    return contractByteArrayEncoder.decode(get_balance.result.returnValue);
  }

  watch(activeAccount, async (address) => {
    activeAccountStableTokenBalance.value = await getAccountStableTokenBalance(
      address
    );
  });

  return {
    activeAccountStableTokenBalance,
  };
}
