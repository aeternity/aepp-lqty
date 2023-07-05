<template>
    <div>
        <v-btn color="primary" block @click.prevent="onOpenTroveDialogPress()">
            Open Trove
        </v-btn>
        <v-dialog
            v-model="isOpenTroveDialogOpen"
            max-width="600px"
            fullscreen
            transition="dialog-left-transition"
            attach
        >
            <v-card>
                <v-card-title> Open Trove </v-card-title>
                <v-card-text>
                    <v-alert
                        v-if="error"
                        class="mb-4"
                        color="error"
                        title="Oops, Something went wrong!"
                        :text="error"
                    ></v-alert>
                    <v-form>
                        <AmountInput
                            v-model="collateral"
                            label="Collateral"
                            suffix="AE"
                        />

                        <AmountInput
                            v-model="borrow"
                            label="Borrow Amount"
                            :suffix="AEUSD_TOKEN.symbol"
                        />


                        <div class="py-4">
                            <div class="py-2">
                                <strong>
                                    Liquidation Reserve:
                                    <HelpTooltip
                                        text="A designated fund is allocated to cover the gas expenses of the liquidator in the event that your Trove requires liquidation. This amount will be added to your debt but will be reimbursed if you choose to close your Trove by fully repaying the outstanding net debt."
                                    />
                                </strong>
                                <div>
                                    {{ stableCoinGasCompensation }}
                                    {{ AEUSD_TOKEN.symbol }}
                                </div>
                            </div>

                            <div class="py-2">
                                <strong>
                                    Borrow Fee:
                                    <HelpTooltip
                                        text="A one-time fee is deducted from the borrowed amount, which makes it interest-free with no recurring fees."
                                    />
                                </strong>
                                <div class="d-flex align-center">
                                    <div class="pr-2">
                                        {{ borrowingFee.prettify(2) }}
                                        {{ AEUSD_TOKEN.symbol }}
                                        <small>(0.50%)</small>
                                    </div>
                                    <v-progress-circular
                                        v-if="loadingBorrowingFee"
                                        indeterminate
                                        color="primary"
                                        size="18"
                                    />
                                </div>
                            </div>

                            <div class="py-2">
                                <strong>
                                    Total Debt:
                                    <HelpTooltip
                                        :text="`Your Trove will hold a total of ${
                                            AEUSD_TOKEN.symbol
                                        }, which amounts to ${minNetDebt.prettify(
                                            2
                                        )} (excluding the ${stableCoinGasCompensation} ${
                                            AEUSD_TOKEN.symbol
                                        } Liquidation Reserve). To reclaim your collateral, you will need to repay this amount.`"
                                    />
                                </strong>
                                <div class="d-flex align-center">
                                    <div class="pr-2">
                                        {{ totalDebtAmount.prettify(2) }}
                                    </div>
                                    <v-progress-circular
                                        v-if="loadingBorrowingFee"
                                        indeterminate
                                        color="primary"
                                        size="18"
                                    />
                                </div>
                            </div>

                            <CollateralRatio :value="collateralRatio" />
                        </div>

                        <v-btn
                            :disabled="!canOpenTrove"
                            :loading="loadingOpenTrove"
                            @click.prevent="onOpenTrovePress()"
                            color="primary"
                            block
                        >
                            Open Trove
                        </v-btn>

                        <div class="py-4">
                            <v-alert type="warning">
                                Minimum total debt requirement is
                                {{ minNetDebt.prettify(2) }}
                                {{ AEUSD_TOKEN.symbol }}
                            </v-alert>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card></v-dialog
        >
    </div>
</template>

<script lang="ts">
import { Decimal, Trove } from "@liquity/lib-base";
import { computed, onMounted, ref, watch } from "vue";
import HelpTooltip from "@/components/Common/HelpTooltip.vue";
import CollateralRatio from "@/components/Liquity/Shared/CollateralRatio.vue";

import { useAeppSdk } from "@/composables";
import { useBorrowerOperations } from "@/composables/borrowerOperations";
import { usePriceFeed } from "@/composables/priceFeed";
import { useTroveManager } from "@/composables/troveManager";
import { useAccounts } from "@/store/accounts";
import { AEUSD_TOKEN } from "@/utils";
import AmountInput from "@/components/Forms/AmountInput.vue";

export default {
    components: {
        CollateralRatio,
        HelpTooltip,
        AmountInput,
    },
    setup() {
        const accounts = useAccounts();
        const { contracts, onAccount } = useAeppSdk();
        const {
            getCompositeDebt,
            getBorrowingFee,
            loadBorrowingRate,
            loadActiveTrove,
        } = useTroveManager();

        const { loadPriceFeed, priceFeed } = usePriceFeed();

        const {
            loadBorrowerOperationsInitialData,
            minNetDebt,
            stableCoinGasCompensation,
        } = useBorrowerOperations();

        const isOpenTroveDialogOpen = ref(false);

        const borrowingFee = ref<Decimal>(Decimal.ZERO);
        const maxBorrowAmount = ref<Decimal>(Decimal.ZERO);

        const collateral = ref<Decimal>(Decimal.ZERO);

        const borrow = ref<Decimal>(Decimal.ZERO);

        const totalDebt = ref();
        const totalDebtAmount = computed<Decimal>(() =>
            Decimal.from(totalDebt.value ?? 0)
        );

        const trove = computed<Trove>(
            () => new Trove(collateral.value, totalDebtAmount.value)
        );

        const collateralRatio = computed(() =>
            !collateral.value.isZero && !borrow.value.isZero
                ? trove.value.collateralRatio(priceFeed.value.toString())
                : Decimal.ZERO
        );

        const maxFeePercentage = ref<Decimal>(Decimal.from(1)); // 18 zeros

        const loadingBorrowingFee = ref(false);

        const loadingOpenTrove = ref(false);

        const error = ref();

        const canOpenTrove = computed(
            (): boolean =>
                minNetDebt.value.lt(borrow.value) &&
                !collateralRatio.value.lte(1.1)
        );

        watch(
            borrow,
            async (borrowValue) => {
                loadingBorrowingFee.value = true;

                borrowingFee.value = await getBorrowingFee(borrowValue);

                totalDebt.value = (await getCompositeDebt(borrowingFee.value))
                    .add(borrowValue)
                    .toString();

                loadingBorrowingFee.value = false;
            },
            {}
        );

        watch(collateral, async () => {
            maxBorrowAmount.value = await getCompositeDebt(collateral.value);
        });

        function onOpenTroveDialogPress() {
            isOpenTroveDialogOpen.value = true;
        }

        async function onOpenTrovePress() {
            loadingOpenTrove.value = true;
            try {
                const tx =
                    await contracts.BorrowerOperations.methods.open_trove(
                        maxFeePercentage.value.bigNumber, // maxFeePercentage.value,
                        borrow.value.bigNumber, //borrow.value,
                        accounts.activeAccount,
                        accounts.activeAccount,
                        {
                            amount: collateral.value.bigNumber,
                            onAccount: onAccount(),
                            waitMined: false,
                        }
                    );

                console.info("========================");
                console.info("open trove tx ::", tx);
                console.info("========================");

                await loadActiveTrove();
                isOpenTroveDialogOpen.value = false;
            } catch (_error: any) {
                error.value = _error.message;
                console.info("========================");
                console.error("OPEN TROVE ERROR ::", _error);
                console.info("========================");
            }

            loadingOpenTrove.value = false;
        }

        onMounted(() => {
            loadPriceFeed();
            loadBorrowingRate();
            loadBorrowerOperationsInitialData();
        });

        return {
            AEUSD_TOKEN,

            loadingBorrowingFee,
            loadingOpenTrove,

            minNetDebt,
            stableCoinGasCompensation,

            totalDebtAmount,
            borrowingFee,
            priceFeed,
            borrow,

            collateral,
            borrow,
            collateralRatio,

            error,

            maxBorrowAmount,

            isOpenTroveDialogOpen,

            canOpenTrove,

            onOpenTroveDialogPress,
            onOpenTrovePress,
        };
    },
};
</script>

<style>
.v-dialog--fullscreen > .v-overlay__content {
    right: 0;
    left: auto;
}
</style>
