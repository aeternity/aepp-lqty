import {
  BrowserWindowMessageConnection,
  SUBSCRIPTION_TYPES,
  walletDetector,
} from "@aeternity/aepp-sdk";
import { WalletInfo } from "@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types";

// Utilities
import { useAeppSdk } from "@/composables";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAccounts } from "./accounts";

export interface Wallet {
  info: {
    id: string;
    type: string;
    origin: string;
  };
  getConnection: () => BrowserWindowMessageConnection;
}

export const useWalletConnect = defineStore(
  "walletConnect",
  () => {
    const { getSdk, scanForAccounts, preloadContracts } = useAeppSdk();
    const accounts = useAccounts();

    const walletInfo = ref<WalletInfo>();
    const scanningForWallets = ref(false);

    async function connectWallet() {
      const wallet = await scanForWallets();

      if (!wallet) {
        return;
      }

      const aeSdk = await getSdk();
      const _walletInfo = await aeSdk.connectToWallet(wallet.getConnection());
      await aeSdk.subscribeAddress(SUBSCRIPTION_TYPES.subscribe, "current");
      await scanForAccounts();


      walletInfo.value = _walletInfo;

      await preloadContracts();
    }

    async function disconnectWallet() {
      const aeSdk = await getSdk();
      accounts.setActiveAccount(undefined);
      accounts.setAccounts([]);
      await aeSdk.disconnectWallet();

      walletInfo.value = undefined;
      window.location.reload();
    }

    /**
     * Scan for wallets
     */
    async function scanForWallets(): Promise<Wallet | undefined> {
      scanningForWallets.value = true;

      const foundWallet: Wallet | undefined = await new Promise((resolve) => {
        const $walletConnectTimeout = setTimeout(() => {
          resolve(undefined);
        }, 30000);

        const handleWallets = async ({
          newWallet,
        }: {
          newWallet?: Wallet | undefined;
        }) => {
          clearTimeout($walletConnectTimeout);
          stopScan();
          resolve(newWallet);
        };

        const scannerConnection = new BrowserWindowMessageConnection({
          debug: true
        });
        const stopScan = walletDetector(scannerConnection, handleWallets);
      });

      scanningForWallets.value = false;

      return foundWallet;
    }

    return {
      walletInfo,

      connectWallet,
      disconnectWallet,
      scanForWallets,
      scanningForWallets,
    };
  },
  { persist: true }
);
