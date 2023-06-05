export * from "./numbers";
export * from "./address";
export * from "./utils";

export function sendTxDeepLinkUrl(encodedTx: any) {
  const currentUrl = new URL(window.location.href);
  // reset url
  currentUrl.searchParams.delete("transaction");
  currentUrl.searchParams.delete("transaction-status");

  // append transaction parameter for success case
  const successUrl = new URL(currentUrl.href);
  successUrl.searchParams.set("transaction", "{transaction}");

  // append transaction parameter for failed case
  const cancelUrl = new URL(currentUrl.href);
  cancelUrl.searchParams.set("transaction-status", "cancelled");

  return createDeepLinkUrl({
    type: "sign-transaction",
    transaction: encodedTx,
    // networkId,
    // decode these urls because they will be encoded again
    "x-success": decodeURI(successUrl.href),
    "x-cancel": decodeURI(cancelUrl.href),
  });
}

export function createDeepLinkUrl({ type, callbackUrl, ...params }: any) {
  const url = new URL(`https://wallet.superhero.com/${type}`);
  if (callbackUrl) {
    url.searchParams.set("x-success", callbackUrl);
    url.searchParams.set("x-cancel", callbackUrl);
  }
  Object.entries(params)
    .filter(([, value]: any) => ![undefined, null].includes(value))
    .forEach(([name, value]: any) => url.searchParams.set(name, value));
  return url;
}
