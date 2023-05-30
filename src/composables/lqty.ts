import { ref } from "vue";
import useAeSdk from "./aeSdk";

const contracts: any = {};
const loadingContracts = ref(true);

export function useLqty() {
  const { aeSdk } = useAeSdk();

  async function preloadContracts() {
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

      const contractInstance = await aeSdk.getContractInstance({
        contractAddress: JSON.parse(contractInfo).address,
        bytecode: contractByteCode,
        aci: JSON.parse(contractACI),
      });

      contracts[contract] = contractInstance;
    }

    loadingContracts.value = false;
  }

  return { contracts, preloadContracts, loadingContracts };
}
