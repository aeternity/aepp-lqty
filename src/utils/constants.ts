import { CurrencyCode, ICurrency, INetwork, IToken } from "@/types";

export const AETERNITY_CONTRACT_ID = 'aeternity';
export const AETERNITY_SYMBOL = 'AE';
export const AETERNITY_COIN_ID = 'aeternity';
export const AETERNITY_COIN_SYMBOL = 'AE Coin';
export const AETERNITY_COIN_NAME = 'Aeternity';
export const AETERNITY_COIN_PRECISION = 18; // Amount of decimals


export const AETERNITY_TOKEN_BASE_DATA: IToken = {
  contractId: AETERNITY_CONTRACT_ID,
  decimals: AETERNITY_COIN_PRECISION,
  name: AETERNITY_COIN_NAME,
  symbol: AETERNITY_SYMBOL,
  convertedBalance: 0,
};


export const AEUSD_TOKEN: IToken = {
  name: "AEUSD",
  symbol: "AEUSD",
  decimals: 17,
  contractId: "ct_21DHaAHUTVYkTDu8WuG6So77SuEd6da9NcuXbsfHg5FH96mB6E",
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

export const DEFAULT_CURRENCY_CODE: CurrencyCode = 'usd';

export const CURRENCIES: ICurrency[] = [
  {
    name: 'United States Dollar',
    code: 'usd',
    symbol: '$',
  },
  {
    name: 'Euro',
    code: 'eur',
    symbol: '€',
  },
  {
    name: 'Australia Dollar',
    code: 'aud',
    symbol: 'AU$',
  },
  {
    name: 'Brasil Real',
    code: 'brl',
    symbol: 'R$',
  },
  {
    name: 'Canada Dollar',
    code: 'cad',
    symbol: 'CA$',
  },
  {
    name: 'Swiss Franc',
    code: 'chf',
    symbol: 'CHF',
  },
  {
    name: 'United Kingdom Pound',
    code: 'gbp',
    symbol: '£',
  },
  {
    name: 'Gold Ounce',
    code: 'xau',
    symbol: 'XAU',
  },
];
