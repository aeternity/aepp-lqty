import BigNumber from "bignumber.js";
import { formatAmount, AE_AMOUNT_FORMATS } from "@aeternity/aepp-sdk";

export function decimalsPrefix(val: any, scale = 18) {
  const strVal = val.toString();
  const strZeros = "0".repeat(scale);

  return BigInt(strVal.concat(strZeros));
}

export function numberFormat(value: number | BigInt, decimals = 18) {
  if (value < 10 ** 12) {
    return value;
  }
  return new BigNumber(value).shiftedBy(-decimals).toString();
}

export const aettosToAe = (v: string | number | bigint | BigNumber) =>
  formatAmount(v, {
    denomination: AE_AMOUNT_FORMATS.AETTOS,
    targetDenomination: AE_AMOUNT_FORMATS.AE,
  });

export const reduceDecimals = (
  val: string | number | BigNumber,
  decimals: number = 18
) => BigNumber(val).shiftedBy(-decimals);

export const expandDecimals = (
  val: string | number | BigNumber,
  decimals: number = 18
) => BigInt(BigNumber(val).shiftedBy(decimals).toFixed(0));
