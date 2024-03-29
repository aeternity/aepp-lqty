import { WatchSource, watch } from "vue";
import { defer } from "lodash-es";
import { Decimal } from "@liquity/lib-base";

/**
 * Watch for the getter to be truthy with the use of the compositionApi.
 */
export function watchUntilTruthy<T>(
  getter: WatchSource<T>
): Promise<NonNullable<T>> {
  return new Promise((resolve) => {
    const unwatch = watch(
      getter,
      (value) => {
        if (value) {
          resolve(value as NonNullable<T>);
          defer(() => unwatch());
        }
      },
      { immediate: true }
    );
  });
}

export async function fetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<T | null> {
  const response = await fetch(url, options);
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export const panic = <T>(e: unknown): T => {
  throw e;
};

export const decimalify = ({ decodedResult }: any): Decimal =>
  Decimal.fromBigNumberString(decodedResult);

export const numberify = ({ decodedResult }: any): Decimal =>
  Decimal.from(decodedResult);
