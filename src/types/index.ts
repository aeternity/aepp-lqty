import { NETWORKS } from "@/utils";

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
