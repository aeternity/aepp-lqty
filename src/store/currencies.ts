import { CoinGecko } from "@/libs/CoinGecko";
import { CurrencyCode, CurrencyRates, ICoin, ICurrency } from "@/types";
import {
  AETERNITY_COIN_ID,
  AETERNITY_TOKEN_BASE_DATA,
  CURRENCIES,
  DEFAULT_CURRENCY_CODE,
} from "@/utils";
import { Decimal } from "@liquity/lib-base";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCurrencies = defineStore(
  "currencies",
  () => {
    /**
     * AE Coin details with additional market info
     */
    const aeternityData = ref<ICoin>();

    /**
     * Stores the list of currencies with the AE coin fiat exchange rate for each of them.
     */
    const currencyRates = ref<CurrencyRates>({} as any);

    const currentCurrencyCode = ref<CurrencyCode>(DEFAULT_CURRENCY_CODE);

    const currentCurrencyRate = computed(
      (): number => currencyRates.value[currentCurrencyCode.value] || 0
    );
    const currentCurrencyInfo = computed(
      (): ICurrency =>
        CURRENCIES.find(({ code }) => code === currentCurrencyCode.value)!
    );

    async function loadAeternityData() {
      try {
        const aeMarketData = await CoinGecko.fetchCoinMarketData(
          AETERNITY_COIN_ID,
          currentCurrencyCode.value
        );

        aeternityData.value = {
          ...(aeMarketData || ({} as any)),
          ...AETERNITY_TOKEN_BASE_DATA,
          convertedBalance: Decimal.ZERO,
        };
      } catch (e) {
        aeternityData.value = undefined;
      }
    }

    function setCurrentCurrency(currency: CurrencyCode) {
      currentCurrencyCode.value = currency;
      loadAeternityData();
    }

    async function loadCurrencyRates() {
      const fetchedCurrencyRates = await CoinGecko.fetchCoinCurrencyRates(
        AETERNITY_COIN_ID
      );

      if (fetchedCurrencyRates) {
        currencyRates.value = fetchedCurrencyRates;
      }
    }

    /**
     * @returns value formatted as a currency according to the user's browser settings
     *   eg.: "23 789,98 £", "$ 25.269,00"
     */
    function formatCurrency(value: Decimal): string {
      return new Intl.NumberFormat(navigator.language, {
        style: "currency",
        currencyDisplay: "narrowSymbol",
        currency: currentCurrencyCode.value,
      }).format(value.shorten());
    }

    /**
     * @param value Aeternity coin amount
     * @returns Aeternity coin converted to fiat
     */
    function getFiat(value: Decimal): Decimal {
      return value.mul(currentCurrencyRate.value);
    }

    /**
     * @param value Aeternity coin amount
     * @returns Aeternity coin converted to fiat and formatted as a currency
     *   according to the user's browser settings
     */
    function getFormattedFiat(value: Decimal) {
      return formatCurrency(getFiat(value));
    }

    /**
     * Does the same as `getFormattedFiat` but avoids displaying small fractions
     * by rounding them to 0.01.
     * @param value Aeternity coin amount
     */
    function getFormattedAndRoundedFiat(value: Decimal): string {
      if (!currentCurrencyRate.value || value === Decimal.ZERO) {
        return formatCurrency(0);
      }
      const converted = getFiat(value);
      return converted < 0.01
        ? `<${formatCurrency(0.01)}`
        : formatCurrency(converted);
    }

    return {
      aeternityData,
      currencyRates,
      currentCurrencyCode,
      currentCurrencyInfo,

      loadAeternityData,
      setCurrentCurrency,
      loadCurrencyRates,

      getFormattedFiat,
      getFormattedAndRoundedFiat,
    };
  },
  { persist: true }
);
