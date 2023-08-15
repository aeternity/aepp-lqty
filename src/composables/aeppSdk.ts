import { useAccounts } from "@/store/accounts";
import { watchUntilTruthy } from "@/utils";
import { AeSdkAepp, Node } from "@aeternity/aepp-sdk";
import { storeToRefs } from "pinia";
import { ref } from "vue";

let aeSdk: AeSdkAepp;
const contracts: any = {};
const loadingContracts = ref(false);
const contractsLoaded = ref(false);

const scanningForAccounts = ref(false);

export function useAeppSdk() {
  const { setAccounts, setActiveAccount } = useAccounts();
  const { activeAccount } = storeToRefs(useAccounts());

  async function scanForAccounts() {
    scanningForAccounts.value = true;
    setAccounts(await aeSdk.askAddresses());
    setActiveAccount(Object.keys(aeSdk._accounts?.current || {})[0] as any);
    scanningForAccounts.value = false;
  }

  function onAccount() {
    return {
      address: () => activeAccount.value,
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
        // {
        //   name: "ae_uat",
        //   instance: new Node("https://mainnet.aeternity.io"),
        // },
        {
          name: "ae_uat",
          instance: new Node("https://testnet.aeternity.io"),
        },
      ],
      compilerUrl: "https://compiler.aepps.com",
      onNetworkChange: (params) => {
        console.log("onNetworkChange", params);
        if (activeAccount) {
          preloadContracts();
        }
      },
      onAddressChange: (a) => {
        console.info("========================");
        console.info("onAddressChange ::", a);
        console.info("========================");

        // setActiveAccount
      },
      onDisconnect: () => {
        setActiveAccount(undefined);
        setAccounts([]);
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
    console.info("preloadContracts aeSdk::", activeAccount);
    console.info("========================");

    loadingContracts.value = true;

    const contractsVersion = '1.0.1';
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
        await import(`../contracts/${contractsVersion}/${contract}.aci.json?raw`)
      ).default;
      const contractInfo = (
        await import(`../contracts/${contractsVersion}/${contract}.info.json?raw`)
      ).default;
      const contractByteCode = (
        await import(`../contracts/${contractsVersion}/${contract}.bytecode?raw`)
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

    console.info("========================");
    console.info("contracts ::", contracts);
    console.info("========================");
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
