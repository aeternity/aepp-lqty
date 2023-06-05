import { ref, watch } from "vue";
import { useLqty } from "./lqty";
import { useAeppSdk } from "./aeppSdk";

const activeAccountStableTokenBalance = ref(BigInt(0));

export function useStableToken() {
  const { activeAccount } = useAeppSdk();
  const { contracts } = useLqty();

  async function loadAccountStableTokenBalance() {
    activeAccountStableTokenBalance.value =
      (await contracts.AEUSDToken.methods.balance(activeAccount.value))
        .decodedResult ?? BigInt(0);
  }

  watch(activeAccount, async (address) => loadAccountStableTokenBalance(), {
    immediate: true,
  });

  return {
    activeAccountStableTokenBalance,
    loadAccountStableTokenBalance,
  };
}
