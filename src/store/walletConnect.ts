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
    const { setAccounts, setActiveAccount } = useAccounts();

    const walletInfo = ref<WalletInfo>();
    const scanningForWallets = ref(false);
    const scanningForAccounts = ref(false);

    async function subscribeAddress() {
      const aeSdk = await getSdk();

      return new Promise((resolve, reject) => {
        scanningForAccounts.value = true;
        const $timeout = setTimeout(() => {
          scanningForAccounts.value = false;
          reject();
        }, 10000);

        (async () => {
          try {
            await aeSdk.subscribeAddress(
              SUBSCRIPTION_TYPES.subscribe,
              "connected"
            );
            await scanForAccounts();

            resolve(true);
          } catch (error) {
            reject(error);
          } finally {
            scanningForAccounts.value = false;
            clearTimeout($timeout);
          }
        })();
      });
    }

    async function connectWallet() {
      const wallet = await scanForWallets();
      console.info("========================");
      console.info("wallet ::", wallet);
      console.info("========================");

      if (!wallet) {
        return;
      }

      const aeSdk = await getSdk();
      try {
        const _walletInfo = await aeSdk.connectToWallet(wallet.getConnection());
        walletInfo.value = _walletInfo;

        await subscribeAddress();
        await preloadContracts();
      } catch (error) {
        console.log("wallet connect error ::", error);

        // disconnectWallet();
      }
    }

    async function disconnectWallet() {
      console.info("========================");
      console.info("disconnectWallet ::");
      console.info("========================");

      const aeSdk = await getSdk();
      setActiveAccount(undefined);
      setAccounts([]);
      try {
        await aeSdk.disconnectWallet();
      } catch (error) {
        //
      }

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
          wallets,
        }: {
          newWallet?: Wallet | undefined;
          wallets: any;
        }) => {
          console.info("========================");
          console.info("newWallet ::", { newWallet, wallets });
          console.info("========================");
          clearTimeout($walletConnectTimeout);
          stopScan();
          resolve(newWallet);
        };

        const scannerConnection = new BrowserWindowMessageConnection({
          debug: true,
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
      scanningForAccounts,
    };
  },
  { persist: true }
);
