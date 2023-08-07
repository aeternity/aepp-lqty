import { Encoded } from "@aeternity/aepp-sdk/es/utils/encoder";

// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccounts = defineStore(
  "accounts",
  () => {
    const accounts = ref<Encoded.AccountAddress[]>([]);
    const activeAccount = ref<Encoded.AccountAddress>();

    function setActiveAccount(account?: Encoded.AccountAddress) {
      activeAccount.value = account;
    }

    function setAccounts(_accounts: Encoded.AccountAddress[]) {
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
