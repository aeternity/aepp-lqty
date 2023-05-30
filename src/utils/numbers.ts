export function decimalsPrefix(val: any, scale = 18) {
  const strVal = val.toString();
  const strZeros = "0".repeat(scale);

  return BigInt(strVal.concat(strZeros));
}
