<template>
    <div class="">
      <div class="text-h5 font-weight-bold">
        {{ amount.prettify(2) }} {{ token.symbol }}
      </div>
      <div class="text-subtitle">
        {{ getFormattedFiat(amount) }}
      </div>
    </div>
</template>

<script lang="ts">
import { useCurrencies } from "@/store/currencies";
import { Decimal } from "@liquity/lib-base";
import { PropType } from "vue";
import { IToken } from '@/types';
import { AETERNITY_TOKEN_BASE_DATA } from "@/utils/constants";
export default {
    props: {
        amount: {
            type: Object as PropType<Decimal>,
            required: true,
        },
        token: {
            type: Object as PropType<IToken>,
            required: false,
            default: () => AETERNITY_TOKEN_BASE_DATA
        },

    },
    setup() {
      const { getFormattedFiat } = useCurrencies();

        return {
          getFormattedFiat
        };
    },
};
</script>
