import { INetwork } from "@/types";

export const AEUSD_TOKEN = {
  name: "AEUSD",
  symbol: "AEUSD",
  decimals: 17,
  contractAddress: "ct_21DHaAHUTVYkTDu8WuG6So77SuEd6da9NcuXbsfHg5FH96mB6E",
};

/**
 * Default `networkId` values returned by the Node after establishing the connection.
 * Nodes returns different values when connecting to the Hyperchains.
 */
export const NETWORK_ID_MAINNET = "ae_mainnet";
export const NETWORK_ID_TESTNET = "ae_uat";

export const NETWORK_MAINNET: INetwork = {
  url: "https://mainnet.aeternity.io",
  networkId: NETWORK_ID_MAINNET,
  middlewareUrl: "https://mainnet.aeternity.io/mdw",
  explorerUrl: "https://explorer.aeternity.io",
  compilerUrl: "https://compiler.aepps.com",
  name: "Mainnet",
};

export const NETWORK_TESTNET: INetwork = {
  url: "https://testnet.aeternity.io",
  networkId: NETWORK_ID_TESTNET,
  middlewareUrl: "https://testnet.aeternity.io/mdw",
  explorerUrl: "https://explorer.testnet.aeternity.io",
  compilerUrl: "https://latest.compiler.aepps.com",
  name: "Testnet",
};

export const NETWORKS = {
  [NETWORK_ID_MAINNET]: NETWORK_MAINNET,
  [NETWORK_ID_TESTNET]: NETWORK_TESTNET,
};

export const ASSETS = [
  AEUSD_TOKEN,
  // {
  //   name: "AEEUR",
  //   symbol: "AEEUR",
  //   decimals: 17,
  //   contractAddress: "ct_21DHaAHUTVYkTDu8WuG6So77SuEd6da9NcuXbsfHg5FH96mB6B", // TODO: fake address
  // },
  // {
  //   name: "AEBITCOIN",
  //   symbol: "AEBITCOIN",
  //   decimals: 17,
  //   contractAddress: "ct_21DHaAHUTVYkTDu8WuG6So77SuEd6da9NcuXbsfHg5FH96mB6D", // TODO: fake address
  // },
  // {
  //   name: "AEDASH",
  //   symbol: "AEDASH",
  //   decimals: 17,
  //   contractAddress: "ct_21DHaAHUTVYkTDu8WuG6So77SuEd6da9NcuXbsfHg5FH96mB6C", // TODO: fake address
  // },
];
