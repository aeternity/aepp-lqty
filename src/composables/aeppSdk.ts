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

    console.info("========================");
    console.info("aeSdk is Ready ::");
    console.info("========================");
  }

  return {
    aeSdk,
    initSdk,

    activeAccount,
    accounts,
    scanningForAccounts,

    scanForAccounts,
  };
}
