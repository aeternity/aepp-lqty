import { sendTxDeepLinkUrl, watchUntilTruthy } from "@/utils";
import { AeSdkAepp, Node } from "@aeternity/aepp-sdk";
import { Accounts } from "@aeternity/aepp-sdk/es/aepp-wallet-communication/rpc/types";
import { ref } from "vue";

let aeSdk: AeSdkAepp;

const accounts = ref<string[]>([]);
const activeAccount = ref();
const scanningForAccounts = ref(false);

export function useAeppSdk() {
  async function scanForAccounts() {
    scanningForAccounts.value = true;
    accounts.value = await aeSdk.askAddresses();
    setActiveAccount(aeSdk._accounts);
    scanningForAccounts.value = false;
  }

  function setActiveAccount(_accounts?: Accounts) {
    if (_accounts) {
      activeAccount.value = Object.keys(_accounts?.current)[0];
    } else {
      activeAccount.value = accounts.value[0];
    }
  }

  function onAccount() {
    return {
      address: () => String(activeAccount.value).toString(),
      sign: async (raw: any, tx: any) => {
        console.info("sign ::", {
          tx,
          raw,
        });

        const _tx = await aeSdk.sign(raw);

        console.info("========================");
        console.info("_tx ::", _tx);
        console.info("========================");
        return _tx;
      },
      signTransaction: async (raw: any, tx: any) => {
        console.info("signTransaction ::", {
          tx,
          raw,
        });

        const _tx = await aeSdk.signTransaction(raw);

        console.info("========================");
        console.info("_tx ::", _tx);
        console.info("========================");
        return _tx;
      },
    };
  }

  async function initSdk() {
    aeSdk = new AeSdkAepp({
      name: "AELQTY",
      nodes: [
        {
          name: "ae_uat",
          instance: new Node("https://testnet.aeternity.io"),
        },
      ],
      compilerUrl: "https://compiler.aepps.com",
      onNetworkChange: (params) => console.log("onNetworkChange", params),
      onAddressChange: setActiveAccount,
      onDisconnect: (params) => console.log("onDisconnect", params),
    });
  }

  /**
   * Get the SDK instance. For now the SDK state is asynchronous.
   */
  async function getSdk(): Promise<AeSdkAepp> {
    return watchUntilTruthy(() => aeSdk);
  }

  return {
    getSdk,
    aeSdk,
    initSdk,

    activeAccount,
    accounts,
    scanningForAccounts,

    scanForAccounts,
    onAccount,
  };
}
