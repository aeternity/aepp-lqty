import { ContractByteArrayEncoder } from "@aeternity/aepp-calldata";
import { AeSdk, MemoryAccount, Node } from "@aeternity/aepp-sdk";
import { ref } from "vue";

// import { getFilesystem} from '../utils/contractLoader';

const NODE_URL = "http://ae-node.zixdev.com:3001";
const COMPILER_URL = "http://ae-node.zixdev.com:3080"; // required for contract interactions

const node = new Node(NODE_URL);
const aeSdk = new AeSdk({
  compilerUrl: COMPILER_URL,
  nodes: [{ name: "testnet", instance: node }],
});

const contractByteArrayEncoder = new ContractByteArrayEncoder();

const accounts = ref([]);
const activeAccount = ref();

export default function useAeSdk() {
  async function addAccount() {
    await aeSdk.addAccount(
      new MemoryAccount({
        keypair: {
          secretKey:
            "7c6e602a94f30e4ea7edabe4376314f69ba7eaa2f355ecedb339df847b6f0d80575f81ffb0a297b7725dc671da0b1769b1fc5cbe45385c7b5ad1fc2eaf1d609d",
          publicKey: "ak_fUq2NesPXcYZ1CcqBcGC3StpdnQw3iVxMA3YSeCNAwfN4myQk",
        },
      }),
      { select: false }
    );

    await aeSdk.addAccount(
      new MemoryAccount({
        keypair: {
          secretKey:
            "9262701814da8149615d025377e2a08b5f10a6d33d1acaf2f5e703e87fe19c83569ecc7803d297fde01758f1bdc9e0c2eb666865284dff8fa39edb2267de70db",
          publicKey: "ak_f9bmi44rdvUGKDsTLp3vMCMLMvvqsMQVWyc3XDAYECmCXEbzy",
        },
      }),
      { select: true }
    );

    accounts.value = Object.keys(aeSdk.accounts) as any;
    activeAccount.value = aeSdk.selectedAddress;
  }

  async function onSelectAccount(address: any) {
    await aeSdk.selectAccount(address);
    activeAccount.value = aeSdk.selectedAddress;
  }

  return {
    aeSdk,
    addAccount,
    contractByteArrayEncoder,
    accounts,
    activeAccount,
    onSelectAccount,
  };
}
