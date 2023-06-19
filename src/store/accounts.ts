import { Accounts } from "@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types";

// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccounts = defineStore(
  "accounts",
  () => {
    const accounts = ref<string[]>([]);
    const activeAccount = ref();

    function setActiveAccount(_accounts?: Accounts) {
      if (_accounts) {
        activeAccount.value = Object.keys(_accounts?.current)[0];
      } else {
        activeAccount.value = accounts.value[0];
      }
    }

    function setAccounts(_accounts: string[]) {
      accounts.value = _accounts;
    }

    return {
      accounts,
      activeAccount,

      setActiveAccount,
      setAccounts,
    };
  },
  { persist: true }
);
