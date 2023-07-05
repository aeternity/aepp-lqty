import { INetwork, INetworkTypes } from "@/types";

import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";

import { NETWORKS, NETWORK_ID_TESTNET } from "@/utils";

import { useWalletConnect } from "./walletConnect";

export const useNetworks = defineStore(
  "networks",
  () => {
    const { walletInfo } = storeToRefs(useWalletConnect());
    const activeNetwork = computed<INetwork>(() => {
      const selectedNetworkId = walletInfo.value?.networkId as INetworkTypes;
      return NETWORKS[selectedNetworkId || NETWORK_ID_TESTNET];
    });

    return {
      activeNetwork,
    };
  },
  { persist: true }
);
