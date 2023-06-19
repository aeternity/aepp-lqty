import { useAccounts } from "@/store/accounts";
import { watchUntilTruthy } from "@/utils";
import { AeSdkAepp, Node } from "@aeternity/aepp-sdk";
import { ref } from "vue";

let aeSdk: AeSdkAepp;
const contracts: any = {};
const loadingContracts = ref(false);
const contractsLoaded = ref(false);

const scanningForAccounts = ref(false);

export function useAeppSdk() {
  const accounts = useAccounts();

  async function scanForAccounts() {
    scanningForAccounts.value = true;
    accounts.setAccounts(await aeSdk.askAddresses());
    accounts.setActiveAccount(aeSdk._accounts);
    scanningForAccounts.value = false;
  }

  function onAccount() {
    return {
      address: () => String(accounts.activeAccount).toString(),
      sign: async (raw: any, tx: any) => {
        console.info("onAccount.sign ::", {
          tx,
          raw,
        });
        return aeSdk.sign(raw);
      },
      signTransaction: async (raw: any, tx: any) => {
        console.info("onAccount.signTransaction ::", {
          tx,
          raw,
        });
        return aeSdk.signTransaction(raw);
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
      onNetworkChange: (params) => {
        console.log("onNetworkChange", params);
        if (accounts.activeAccount) {
          preloadContracts();
        }
      },
      onAddressChange: accounts.setActiveAccount,
      onDisconnect: (params) => {
        accounts.setActiveAccount(undefined);
        accounts.setAccounts([]);
        contractsLoaded.value = false;
        contracts.value = {};
      },
    });
  }

  /**
   * Get the SDK instance. For now the SDK state is asynchronous.
   */
  async function getSdk(): Promise<AeSdkAepp> {
    return watchUntilTruthy(() => aeSdk);
  }

  async function preloadContracts() {
    const sdk = await getSdk();
    console.info("========================");
    console.info("preloadContracts aeSdk::", accounts.activeAccount);
    console.info("========================");

    loadingContracts.value = true;

    const _contracts = [
      "ActivePool",
      "AEUSDToken",
      "BorrowerOperations",
      "CollSurplusPool",
      "CommunityIssuance",
      "DefaultPool",
      "GasPool",
      "LockupContractFactory",
      "LQTYStaking",
      "LQTYToken",
      "PriceFeedTestnet",
      "SortedTroves",
      "StabilityPool",
      "TimestampOffsetForDebug",
      "TroveManager",
    ];

    for (const contract of _contracts) {
      const contractACI = (
        await import(`../contracts/${contract}.aci.json?raw`)
      ).default;
      const contractInfo = (
        await import(`../contracts/${contract}.info.json?raw`)
      ).default;
      const contractByteCode = (
        await import(`../contracts/${contract}.bytecode?raw`)
      ).default;

      const contractInstance = await sdk.getContractInstance({
        contractAddress: JSON.parse(contractInfo).address,
        bytecode: contractByteCode,
        aci: JSON.parse(contractACI),
        omitUnknown: true,
      });

      contracts[contract] = contractInstance;
    }

    loadingContracts.value = false;
    contractsLoaded.value = true;

    console.info('========================');
    console.info('contracts ::', contracts);
    console.info('========================');

  }

  return {
    getSdk,
    aeSdk,
    initSdk,

    scanningForAccounts,
    preloadContracts,

    contracts,
    contractsLoaded,
    loadingContracts,

    scanForAccounts,
    onAccount,
  };
}
