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
      console.info("========================");
      console.info("setActiveAccount ::", account);
      console.info("========================");
      activeAccount.value = account;
    }

    function setAccounts(_accounts: Encoded.AccountAddress[]) {
      console.info("========================");
      console.info("setAccounts ::", _accounts);
      console.info("========================");

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
