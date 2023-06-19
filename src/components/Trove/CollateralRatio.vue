<template>
    <div class="py-2">
        <div class="d-flex justify-space-between">
            <strong>
                Collateral ratio:

                <v-tooltip
                    text="The ratio between the dollar value of the collateral and the debt (in AEUSD) you are depositing. While the Minimum Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety."
                >
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" icon="mdi-information"></v-icon>
                    </template>
                </v-tooltip>
            </strong>
            <div v-if="!value?.eq(0)">
                <v-chip color="green" v-if="value?.gt(2)"> Safe </v-chip>
                <v-chip color="warning" v-else-if="value?.gt(1.1)">
                    Recovery Mode
                </v-chip>
                <v-chip color="red" v-else> Liquidate </v-chip>
            </div>
        </div>
        <div>
            Max: ICR.
            <strong :class="[!value?.eq(0) && `text-${progressColor}`]">
                {{ collateralRatioPct.prettify() }}</strong
            >
        </div>
        <v-progress-linear
            :color="!value?.eq(0) ? progressColor : 'muted'"
            :model-value="collateralRatioPct.prettify()"
        ></v-progress-linear>
    </div>
</template>

<script lang="ts">
import {
    Decimal,
    Difference,
    Percent,
    CRITICAL_COLLATERAL_RATIO,
} from "@liquity/lib-base";
import { computed, PropType } from "vue";

export default {
    props: {
        value: {
            type: Object as PropType<Decimal>,
            required: true,
        },
        change: {
            type: Object as PropType<Difference>,
            required: false,
            default: null,
        },
    },
    setup(props) {
        const collateralRatioPct = computed(
            () => new Percent(props.value ?? 0)
        );
        const changePct = computed(
            () => props.change && new Percent(props.change)
        );

        const progressColor = computed(() =>
            props.value?.gt(2)
                ? "green"
                : props.value?.gt(1.1)
                ? "warning"
                : props.value?.lt(1.1)
                ? "red"
                : "muted"
        );
        return {
            collateralRatioPct,
            changePct,
            progressColor,
            CRITICAL_COLLATERAL_RATIO,
        };
    },
};
</script>
