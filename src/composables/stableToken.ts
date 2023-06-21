import { useAccounts } from "@/store/accounts";
import { ref, watch } from "vue";
import { useAeppSdk } from "./aeppSdk";
import { Decimal } from "@liquity/lib-base";

const activeAccountStableTokenBalance = ref<Decimal>(Decimal.ZERO);

export function useStableToken() {
  const accounts = useAccounts();

  const { contracts } = useAeppSdk();

  async function loadAccountStableTokenBalance() {
    activeAccountStableTokenBalance.value = Decimal.fromBigNumberString(
      (await contracts.AEUSDToken.methods.balance(accounts.activeAccount))
        .decodedResult
    );
  }

  watch(
    () => accounts.activeAccount,
    () => loadAccountStableTokenBalance(),
    {
      immediate: true,
    }
  );

  return {
    activeAccountStableTokenBalance,
    loadAccountStableTokenBalance,
  };
}
