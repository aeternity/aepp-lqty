// Utilities
import { useAeppSdk } from "@/composables";
import { Decimal } from "@liquity/lib-base";
import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useAccounts } from "./accounts";

export const useBalances = defineStore(
  "balances",
  () => {
    const { getSdk } = useAeppSdk();
    const accounts = useAccounts();
    const balances = ref<Record<string, string>>({});
    const balance = computed<Decimal>(() =>
      Decimal.fromBigNumberString(balances.value[accounts.activeAccount] ?? 0)
    );

    async function loadBalance() {
      const aeSdk = await getSdk();
      balances.value[accounts.activeAccount] = await aeSdk.getBalance(
        accounts.activeAccount
      );
    }

    watch(
      () => accounts.activeAccount,
      (address: string, oldAddress: string) => {
        if (address !== oldAddress) {
          balances.value[address] = "0";
        }
        loadBalance();
      }
    );

    onMounted(() => {
      loadBalance();

      setInterval(() => {
        loadBalance();
      }, 5000);
    });

    return {
      balance,
    };
  },
  { persist: true }
);
