<template>
    <div>
        <v-btn color="primary" block @click.prevent="onOpenTroveDialog()">
            Open Trove
        </v-btn>
        <v-dialog v-model="openTroveDialog" max-width="600px">
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
                            <div>
                                <strong> Borrowing Fee: </strong>
                                <v-progress-circular
                                    indeterminate
                                    color="primary"
                                    size="18"
                                    v-if="loadingBorrowingFee"
                                ></v-progress-circular>
                                <span v-else>
                                    {{ aettosToAe(borrowingFee) }}
                                </span>
                            </div>

                            <div>minNetDebt ::{{ aettosToAe(minNetDebt) }}</div>
                            <div>priceFeed ::{{ aettosToAe(priceFeed) }}</div>
                        </div>
                        <v-btn
                            :loading="loadingOpenTrove"
                            @click.prevent="openTrove()"
                            color="primary"
                            block
                        >
                            Open Trove
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card></v-dialog
        >
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { aettosToAe } from "@/utils/numbers";

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
const borrowAmount = ref(0);
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
    console.log("borrowingFee ::", borrowingFee.value);

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
    const amount = (ICR * totalDebt) / priceFeed.value;

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
