<template>
    <div>
        <v-btn color="primary" block @click.prevent="onOpenTroveDialog()">
            Open Trove
        </v-btn>
        <v-dialog
            v-model="openTroveDialog"
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
                        <v-text-field
                            outline
                            label="Collateral"
                            type="number"
                            v-model="collateral"
                            suffix="AE"
                        ></v-text-field>
                        <v-text-field
                            label="Borrow Amount"
                            type="number"
                            v-model="borrowAmount"
                            inn
                            suffix="AEUSD"
                        ></v-text-field>
                        <div class="py-4">
                            <div class="py-2">
                                <strong> Liquidation Reserve: </strong>
                                <div>{{ numberFormat(priceFeed) }} AEUSD</div>
                            </div>

                            <div class="py-2">
                                <strong> Borrow Fee: </strong>
                                <div class="d-flex align-center">
                                    <div class="pr-2">
                                        {{ numberFormat(borrowingFee) }} AEUSD
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
                                <strong> Total Debt: </strong>
                                <div class="d-flex align-center">
                                    <div class="pr-2">
                                        {{ numberFormat(totalDebt) }} AEUSD
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
                                <div class="d-flex justify-space-between">
                                    <strong> Status: </strong>
                                    <v-chip color="green"> Safe </v-chip>
                                </div>
                                <div>Max: ICR. 50%</div>
                                <v-progress-linear
                                    model-value="20"
                                ></v-progress-linear>
                            </div>

                            <div class="py-2">
                                <strong> Liquidation Price (AE): </strong>
                                <div>(TODO)</div>
                            </div>
                        </div>

                        <v-btn
                            :loading="loadingOpenTrove"
                            @click.prevent="openTrove()"
                            color="primary"
                            block
                        >
                            Open Trove
                        </v-btn>

                        <div class="py-4">
                            <v-alert type="warning">
                                Minimum total debt requirement is
                                {{ numberFormat(minNetDebt) }} AEUSD
                            </v-alert>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card></v-dialog
        >
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { numberFormat } from "@/utils/numbers";

import useAeSdk from "@/composables/aeSdk";
import { useLqty } from "@/composables/lqty";
import { useTroveManager } from "@/composables/troveManager";
import { usePriceFeed } from "@/composables/priceFeed";
import { useBorrowerOperations } from "@/composables/borrowerOperations";
import { decimalsPrefix } from "@/utils/numbers";

const { contracts } = useLqty();
const { aeSdk, activeAccount } = useAeSdk();
const {
    getCompositeDebt,
    loadBorrowingRate,
    getActualDebtFromComposite,
    loadActiveTrove,
} = useTroveManager();

const { loadPriceFeed, priceFeed } = usePriceFeed();

const { loadBorrowerOperationsInitialData, minNetDebt } =
    useBorrowerOperations();

const openTroveDialog = ref(false);
const collateral = ref(0);
const compositeDebt = ref(BigInt(0));
const borrowAmount = ref(0);
const totalDebt = ref(BigInt(0));
const maxFeePercentage = ref("1000000000000000000"); // 18 zeros

const loadingBorrowingFee = ref(false);
const borrowingFee = ref(0);

const loadingOpenTrove = ref(false);

const error = ref();

watch(borrowAmount, async (borrowAmountValue) => {
    loadingBorrowingFee.value = true;

    borrowingFee.value = (
        await contracts.TroveManager.methods.get_borrowing_fee(
            decimalsPrefix(borrowAmountValue)
        )
    ).decodedResult;

    compositeDebt.value = await getCompositeDebt(borrowingFee.value);
    totalDebt.value = compositeDebt.value + decimalsPrefix(borrowAmountValue);

    loadingBorrowingFee.value = false;
});

function onOpenTroveDialog() {
    openTroveDialog.value = true;
}

async function openTrove() {
    loadingOpenTrove.value = true;
    const _borrowAmount = decimalsPrefix(borrowAmount.value);
    // find
    const compositeDebt = await getCompositeDebt(borrowingFee.value);
    const totalDebt = compositeDebt + _borrowAmount;
    const netDebt = await getActualDebtFromComposite(totalDebt);
    const ICR = BigInt(decimalsPrefix(2));
    const amount = (_borrowAmount * totalDebt) / priceFeed.value;
    // const amount = (ICR * totalDebt) / priceFeed.value;

    console.info("========================");
    console.info("priceFeed ::", priceFeed);
    console.info("_borrowAmount ::", _borrowAmount);
    console.info("compositeDebt ::", compositeDebt);
    console.info("totalDebt ::", totalDebt);
    console.info("netDebt ::", netDebt);
    console.info("ICR ::", ICR);
    console.info("amount ::", amount);
    console.info("========================");

    // maxFeePercentage, borrowAmount, upperHint, lowerHint, extraParams
    try {
        await contracts.BorrowerOperations.methods.open_trove(
            maxFeePercentage.value, // maxFeePercentage.value,
            amount, //borrowAmount.value,
            activeAccount.value,
            activeAccount.value,
            {
                amount: decimalsPrefix(collateral.value),
                onAccount: aeSdk.accounts[activeAccount.value],
            }
        );

        await loadActiveTrove();
        openTroveDialog.value = false;
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
</script>

<style>
.v-dialog--fullscreen > .v-overlay__content {
    right: 0;
    left: auto;
}
</style>
