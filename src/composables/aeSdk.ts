import { ContractByteArrayEncoder } from "@aeternity/aepp-calldata";
import { AeSdk, MemoryAccount, Node } from "@aeternity/aepp-sdk";

// import { getFilesystem} from '../utils/contractLoader';

const NODE_URL = "http://ae-node.zixdev.com:3001";
const COMPILER_URL = "http://ae-node.zixdev.com:3080"; // required for contract interactions
const mainTestAccount = new MemoryAccount({
  // replace <SENDER_SECRET> and <SENDER_PUBLIC_KEY> with the generated keypair from step 2
  keypair: {
    secretKey:
      "9262701814da8149615d025377e2a08b5f10a6d33d1acaf2f5e703e87fe19c83569ecc7803d297fde01758f1bdc9e0c2eb666865284dff8fa39edb2267de70db",
    publicKey: "ak_f9bmi44rdvUGKDsTLp3vMCMLMvvqsMQVWyc3XDAYECmCXEbzy",
  },
});

const node = new Node(NODE_URL);
const aeSdk = new AeSdk({
  compilerUrl: COMPILER_URL,
  nodes: [{ name: "testnet", instance: node }],
});

aeSdk.addAccount(mainTestAccount, { select: true });
const contractByteArrayEncoder = new ContractByteArrayEncoder();

export default function useAeSdk() {
  return { aeSdk, contractByteArrayEncoder };
}
