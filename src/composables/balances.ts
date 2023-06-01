import { ref, watch } from "vue";
import { useAeppSdk } from "./aeppSdk";

const balance = ref();
export function useBalances() {
  const { aeSdk, activeAccount } = useAeppSdk();

  async function loadBalance() {
    if (!activeAccount.value) return;
    balance.value = await aeSdk.getBalance(activeAccount.value);
  }

  watch(activeAccount, loadBalance, { immediate: true });

  return {
    balance,
    loadBalance,
  };
}
