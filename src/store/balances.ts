import { useAeppSdk } from "@/composables";
import { AEUSD_SYMBOL, AE_SYMBOL, LQTY_SYMBOL } from "@/utils";
import { Decimal } from "@liquity/lib-base";
import { defineStore, storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useAccounts } from "./accounts";

export const useBalances = defineStore(
  "balances",
  () => {
    const { getSdk, contracts } = useAeppSdk();
    const { activeAccount } = storeToRefs(useAccounts());

    const _balances = ref<Record<string, Record<string, string>>>({});

    const balances = computed<Record<string, Decimal>>(() => {
      const newBalances: Record<string, Decimal> = {};
      if (activeAccount.value && _balances.value[activeAccount.value]) {
        Object.keys(_balances.value[activeAccount.value]).forEach((key) => {
          if (
            activeAccount.value &&
            _balances.value[activeAccount.value][key]
          ) {
            newBalances[key] = Decimal.fromBigNumberString(
              _balances.value[activeAccount.value][key]
            );
          }
        });
      }
      return newBalances;
    });

    // AE balance
    const balance = computed<Decimal>(
      () => balances.value[AE_SYMBOL] || Decimal.ZERO
    );

    const aeusdBalance = computed<Decimal>(
      () => balances.value[AEUSD_SYMBOL] || Decimal.ZERO
    );

    const lqtyBalance = computed<Decimal>(
      () => balances.value[LQTY_SYMBOL] || Decimal.ZERO
    );

    async function loadBalances() {
      if (!activeAccount.value) return;

      const aeSdk = await getSdk();

      const [ae_balance, lqty_balance, aeusd_balance] = await Promise.all([
        aeSdk.getBalance(activeAccount.value as any),
        contracts.LQTYToken.methods
          .balance(activeAccount.value)
          .then(({ decodedResult }: any) => decodedResult),
        contracts.AEUSDToken.methods
          .balance(activeAccount.value)
          .then(({ decodedResult }: any) => decodedResult),
      ]);

      _balances.value[activeAccount.value] = {
        [AE_SYMBOL]: ae_balance,
        [LQTY_SYMBOL]: lqty_balance,
        [AEUSD_SYMBOL]: aeusd_balance,
      };
    }

    watch(activeAccount, () => loadBalances());

    // TODO: should be called 1 time only
    onMounted(() => {
      loadBalances();

      setInterval(() => {
        loadBalances();
      }, 5000);
    });

    return {
      balance,
      aeusdBalance,
      lqtyBalance,
      balances,
    };
  },
  { persist: true }
);
