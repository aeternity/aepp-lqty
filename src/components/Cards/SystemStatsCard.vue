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
                        <small>{{ totalValueLocked }}</small>
                    </v-card-title>
                    <v-card-text> Total Locked Value </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card>
                    <v-card-title>
                        {{ total.debt.shorten() }}
                    </v-card-title>
                    <v-card-text> AEUSD Supply </v-card-text>
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
                    <v-card-text> AEUSD in Stability Pool </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3" v-if="dataReady">
                <v-card>
                    <v-card-title>
                        {{ numberOfTrovesPretty }}
                    </v-card-title>
                    <v-card-text> Total Open Troves </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-card v-if="dataReady">
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
import { useLiquityStore } from "@/store/liquityStore";
import { Decimal, Percent } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

export default {
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

        const numberOfTrovesPretty = computed(() =>
            Decimal.from(numberOfTroves.value).prettify(0)
        );

        const totalValueLocked = computed<string>(
            () =>
                `($${Decimal.from(
                    total.value.collateral.mul(price.value)
                ).shorten()})`
        );

        // const lusdInStabilityPoolPct =
        //     total.value.debt.nonZero &&
        //     new Percent(lusdInStabilityPool.value.div(total.value.debt));
        // const totalCollateralRatioPct = new Percent(
        //     total.value.collateralRatio(price.value)
        // );
        // const borrowingFeePct = new Percent(borrowingRate);
        // const kickbackRatePct =
        //     frontendTag === AddressZero
        //         ? "100"
        //         : kickbackRate?.mul(100).prettify();

        onMounted(async () => {
            await preloadInitialData();
            dataReady.value = true;
        });

        return {
            dataReady,
            totalValueLocked,
            borrowingFeePct,
            totalCollateralRatioPct,
            lusdInStabilityPoolPct,
            total,
            price,
            totalStakedLQTY,
            lusdInStabilityPool,
            numberOfTrovesPretty,
        };
    },
};
</script>
