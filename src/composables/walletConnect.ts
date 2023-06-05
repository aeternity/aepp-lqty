import {
  BrowserWindowMessageConnection,
  SUBSCRIPTION_TYPES,
  walletDetector,
} from "@aeternity/aepp-sdk";
import { ref } from "vue";
import { useAeppSdk } from "./aeppSdk";
import { WalletInfo } from "@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types";

const connectedWalletInfo = ref<WalletInfo>();
const scanningForWallets = ref(false);

export function useWalletConnect() {
  const { getSdk, scanForAccounts } = useAeppSdk();

  /**
   * Scan for wallets
   */
  async function scanForWallets() {
    const aeSdk = await getSdk()
    scanningForWallets.value = true;

    const foundWallet: any = await new Promise((resolve) => {
      const handleWallets = async ({ newWallet }: any) => {
        stopScan();
        resolve(newWallet);
      };
      const scannerConnection = new BrowserWindowMessageConnection();
      const stopScan = walletDetector(scannerConnection, handleWallets);
    });

    const walletInfo = await aeSdk.connectToWallet(foundWallet.getConnection());
    await aeSdk.subscribeAddress(SUBSCRIPTION_TYPES.subscribe, "current");

    await scanForAccounts();

    scanningForWallets.value = false;

    connectedWalletInfo.value = walletInfo;
  }

  return {
    scanningForWallets,
    scanForWallets,
    connectedWalletInfo,
  };
}
