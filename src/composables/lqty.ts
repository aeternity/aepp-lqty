import { ref } from "vue";
import { useAeppSdk } from "./aeppSdk";

const contracts: any = {};
const loadingContracts = ref(false);
const contractsLoaded = ref(false);

export function useLqty() {
  const { getSdk } = useAeppSdk();

  async function preloadContracts() {
    const sdk = await getSdk();
    console.info("========================");
    console.info("preloadContracts aeSdk::", sdk);
    console.info("========================");

    loadingContracts.value = true;
    const deployableContracts = ["TroveManager"];

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
  }

  return { contracts, preloadContracts, loadingContracts, contractsLoaded };
}
