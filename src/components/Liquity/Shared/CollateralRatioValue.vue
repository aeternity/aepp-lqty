<template>
    <div :class="[textColor]">
        {{ collateralRatioPrc.prettify() }}
    </div>
</template>

<script lang="ts">
import { computed, PropType } from "vue";
import { CRITICAL_COLLATERAL_RATIO, Percent, Trove } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { usePriceFeed } from "@/store/priceFeed";

export default {
    props: {
        trove: {
            type: Object as PropType<Trove>,
            required: true,
        },
    },
    setup(props) {
        const { priceFeed } = storeToRefs(usePriceFeed());

        const collateralRatio = computed(() =>
            props.trove.collateralRatio(priceFeed.value.toString())
        );

        const collateralRatioPrc = computed(
            () => new Percent(collateralRatio.value)
        );

        const textColor = computed(() =>
            collateralRatio.value.gt(CRITICAL_COLLATERAL_RATIO)
                ? "text-green"
                : collateralRatio.value.gt(1.2)
                ? "text-orange"
                : "text-red"
        );

        return {
            collateralRatio,
            collateralRatioPrc,
            textColor,
        };
    },
};
</script>
