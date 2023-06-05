export function formatAddress(address: string) {
  return `${address.slice(0, 7)}...${address.slice(-4)}`;
}


export const createOnAccountObject = (address: any) => ({
  address: () => address,
  sign: () => {
    throw new Error('Private key is not available');
  },
});
