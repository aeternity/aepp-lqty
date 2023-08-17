<template>
    <div class="">
        <div class="text-h5 font-weight-bold">
            {{ amount.prettify(2) }} {{ token.symbol }}
        </div>
        <div class="text-subtitle">
            {{ formattedFiat }}
        </div>
    </div>
</template>

<script lang="ts">
import { useCurrencies } from "@/store/currencies";
import { Decimal } from "@liquity/lib-base";
import { computed, PropType } from "vue";
import { IToken } from "@/types";
import { AETERNITY_TOKEN_BASE_DATA, AE_SYMBOL } from "@/utils/constants";
import { storeToRefs } from "pinia";
import { usePriceFeed } from "@/store/priceFeed";
export default {
    props: {
        amount: {
            type: Object as PropType<Decimal>,
            required: true,
        },
        token: {
            type: Object as PropType<IToken>,
            required: false,
            default: () => AETERNITY_TOKEN_BASE_DATA,
        },
    },
    setup(props) {
        const { getFormattedFiat } = useCurrencies();
        const { priceFeed } = storeToRefs(usePriceFeed());

        const formattedFiat = computed(() =>
            getFormattedFiat(
                props.amount.div(
                    props.token.symbol == AE_SYMBOL ? 1 : priceFeed.value
                )
            )
        );

        return {
            formattedFiat,
        };
    },
};
</script>
