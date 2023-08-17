import { CoinGeckoMarketResponse } from "@/libs/CoinGecko";
import { AETERNITY_COIN_ID, NETWORKS } from "@/utils";
import { Encoded } from "@aeternity/aepp-sdk/es/utils/encoder";

export interface INetwork {
  url: string;
  name: string;
  middlewareUrl: string;
  explorerUrl: string;
  networkId: string;
  compilerUrl: string;
  index?: number;
}

export type INetworkTypes = keyof typeof NETWORKS;

export interface IToken {
  contractId: Encoded.contractId | typeof AETERNITY_COIN_ID;
  contract_txi?: number;
  convertedBalance?: number; // Amount of the token that is owned
  decimals: number;
  event_supply?: number;
  extensions?: string[];
  holders?: number;
  image?: string;
  initial_supply?: number;
  name: string;
  symbol: string;
  text?: string; // TODO determine if we can remove this
  value?: string; // TODO copy of the contractId, maybe we should remove it
}

export type CurrencyCode = 'usd' | 'eur' | 'aud' | 'brl' | 'cad' | 'chf' | 'cny' | 'czk' | 'dkk' | 'gbp' | 'hkd' | 'huf' | 'idr' | 'ils' | 'inr' | 'jpy' | 'krw' | 'mxn' | 'myr' | 'nok' | 'nzd' | 'php' | 'pln' | 'rub' | 'sek' | 'sgd' | 'thb' | 'try' | 'zar' | 'xau';

export interface ICurrency {
  name: string;
  code: CurrencyCode;
  symbol: string;
}

export type CurrencyRates = Record<CurrencyCode, number>;


/**
 * Coins are specific to the network user can connect to. We assume each network
 * can have only one coin and many tokens.
 */
export type ICoin = IToken & Omit<CoinGeckoMarketResponse, 'image'>;

/**
 * In general the "Asset" is any form of coin or fungible token we use in the app.
 */
export type IAsset = ICoin | IToken;
