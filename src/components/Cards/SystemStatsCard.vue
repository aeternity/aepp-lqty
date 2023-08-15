<template>
    <div>
        <v-row class="mb-8">
            <v-col cols="12">
                <h2>AE LQTY Statistics</h2>
            </v-col>
            <v-col cols="12" md="3">
                <v-card>
                    <v-card-title>
                        {{ total.collateral.shorten() }} AE
                        <small>
                            ({{ getFormattedFiat(total.collateral) }})</small
                        >
                    </v-card-title>
                    <v-card-text>
                        Total Locked Value
                        <HelpTooltip
                            text="The Total Value Locked (TVL) represents the cumulative value of AE locked within the system as collateral, denominated in both AE and USD."
                        />
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card>
                    <v-card-title>
                        {{ total.debt.shorten() }}
                    </v-card-title>
                    <v-card-text>
                        AEUSD Supply
                        <HelpTooltip
                            text="The cumulative amount of AEUSD created through the Liquity Protocol."
                        />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3" v-if="dataReady">
                <v-card>
                    <v-card-title>
                        {{ lusdInStabilityPool.shorten() }}
                        <small>
                            &nbsp;({{ lusdInStabilityPoolPct.toString(1) }})
                        </small>
                    </v-card-title>
                    <v-card-text>
                        AEUSD in Stability Pool
                        <HelpTooltip
                            text="The current amount of AEUSD held in the Stability Pool, both as a numerical value and a fraction relative to the total AEUSD supply."
                        />
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3" v-if="dataReady">
                <v-card>
                    <v-card-title>
                        {{ numberOfTroves.prettify(0) }}
                    </v-card-title>
                    <v-card-text> Total Open Troves </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-card v-if="dataReady && showProtocolStats">
            <v-card-title> Protocol </v-card-title>
            <v-divider />
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="3">
                        <strong> Borrowing fee: </strong>
                        {{ borrowingFeePct.toString(2) }}
                    </v-col>
                    <v-col cols="12" md="3">
                        <strong> Total Collateral Ratio: </strong>
                        {{ totalCollateralRatioPct.prettify() }}
                    </v-col>
                    <v-col cols="12" md="3">
                        <strong> Staked LQTY: </strong>
                        {{ totalStakedLQTY.shorten() }}
                    </v-col>
                    <v-col cols="12" md="3">
                        <strong> Recovery Mode: </strong>
                        {{
                            total.collateralRatioIsBelowCritical(price)
                                ? "Yes"
                                : "No"
                        }}
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import { useCurrencies } from "@/store/currencies";
import { useLiquityStore } from "@/store/liquityStore";
import { Percent } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import HelpTooltip from "../Common/HelpTooltip.vue";

export default {
    components: { HelpTooltip },
    props: {
      showProtocolStats: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
        const { preloadInitialData } = useLiquityStore();
        const dataReady = ref(false);
        const {
            numberOfTroves,
            price,
            lusdInStabilityPool,
            total,
            borrowingRate, //
            totalStakedLQTY,
            // kickbackRate, //
        } = storeToRefs(useLiquityStore());

        const { getFormattedFiat } = useCurrencies();

        const lusdInStabilityPoolPct = computed(
            () =>
                total.value.debt.nonZero &&
                new Percent(lusdInStabilityPool.value.div(total.value.debt))
        );

        const totalCollateralRatioPct = computed(
            () => new Percent(total.value.collateralRatio(price.value))
        );

        const borrowingFeePct = computed(
            () => new Percent(borrowingRate.value)
        );

        onMounted(async () => {
            await preloadInitialData();
            dataReady.value = true;
        });

        return {
            dataReady,
            borrowingFeePct,
            totalCollateralRatioPct,
            lusdInStabilityPoolPct,
            total,
            price,
            totalStakedLQTY,
            lusdInStabilityPool,
            numberOfTroves,
            getFormattedFiat,
        };
    },
};
</script>
