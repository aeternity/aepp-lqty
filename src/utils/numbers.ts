import BigNumber from 'bignumber.js'

export function decimalsPrefix(val: any, scale = 18) {
  const strVal = val.toString();
  const strZeros = "0".repeat(scale);

  return BigInt(strVal.concat(strZeros));
}

export function numberFormat(value: number | BigInt) {
  if (value < 10 ** 12) {
    return value
  }
  return new BigNumber(value).shiftedBy(-18).toString()
}

export function aettosToAe(value: number | BigInt) {
  if (value < 10 ** 12) {
    return value + ' ættos'
  }
  return new BigNumber(value).shiftedBy(-18).toString() + ' AE'
}
