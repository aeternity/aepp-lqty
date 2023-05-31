import { ref, watch } from "vue";
import useAeSdk from "./aeSdk";
import { useLqty } from "./lqty";

const activeAccountStableTokenBalance = ref(BigInt(0));

export function useStableToken() {
  const { activeAccount } = useAeSdk();
  const { contracts } = useLqty();

  async function loadAccountStableTokenBalance() {
    activeAccountStableTokenBalance.value = (
      await contracts.AEUSDToken.methods.balance(activeAccount.value)
    ).decodedResult ?? BigInt(0);
  }

  watch(activeAccount, async (address) => loadAccountStableTokenBalance(), {
    immediate: true,
  });

  return {
    activeAccountStableTokenBalance,
    loadAccountStableTokenBalance,
  };
}
