<template>
    <div>
        <v-btn @click.prevent="onOpenTroveDialog()"> Open Trove </v-btn>
        <v-dialog v-model="openTroveDialog" max-width="600px">
            <v-card>
                <v-card-title> Open Trove </v-card-title>
                <v-card-text>
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
const { aeSdk, contractByteArrayEncoder, activeAccount } = useAeSdk();
const {
    getCompositeDebt,
    loadBorrowingRate,
    getActualDebtFromComposite,

    loadingBorrowingRate,
    borrowingRate,
} = useTroveManager();

const {
    loadPriceFeed,

    priceFeed,
    loadingPriceFeed,
} = usePriceFeed();

const { loadBorrowerOperationsInitialData, minNetDebt, loadingMinNetDebt } =
    useBorrowerOperations();

const openTroveDialog = ref(false);
const collateral = ref(0);
const borrowAmount = ref(0);
const maxFeePercentage = ref("1000000000000000000"); // 18 zeros

const loadingBorrowingFee = ref(false);
const borrowingFee = ref(0);

const loadingOpenTrove = ref(false);

watch(borrowAmount, async (borrowAmountValue) => {
    loadingBorrowingFee.value = true;
    const get_borrowing_fee =
        await contracts.TroveManager.methods.get_borrowing_fee(
            borrowAmountValue
        );
    borrowingFee.value = contractByteArrayEncoder.decode(
        get_borrowing_fee.result.returnValue
    );
    console.log("borrowingFee ::", borrowingFee.value);

    loadingBorrowingFee.value = false;
});

function onOpenTroveDialog() {
    openTroveDialog.value = true;
}

async function openTrove() {
    loadingOpenTrove.value = true;
    const _borrowAmount = BigInt(borrowAmount.value * 1000000000000000000);
    // find
    const compositeDebt = await getCompositeDebt(borrowingFee.value);
    const totalDebt = compositeDebt + _borrowAmount;
    const netDebt = await getActualDebtFromComposite(totalDebt);
    const ICR = BigInt(decimalsPrefix(2));
    const amount = (ICR * totalDebt) / priceFeed.value;
    console.info("========================");
    console.info("compositeDebt ::", compositeDebt);

    console.info("totalDebt ::", totalDebt);

    console.info("netDebt ::", netDebt);
    console.info("ICR ::", ICR);
    console.info("amount ::", amount);

    // const price = await contracts.priceFeedTestnet.get_price()
    console.info("========================");
    ///
    console.info("========================");
    console.info("maxFeePercentage.value ::", maxFeePercentage.value);
    console.info("========================");
    const upperHint = activeAccount.value;
    const lowerHint = activeAccount.value;

    if (minNetDebt.value <= netDebt) {
        console.info("========================");
        console.info("minNetDebt.value ::", minNetDebt.value);
        console.info("netDebt ::", netDebt);
        console.info("========================");
        loadingOpenTrove.value = false;
        return;
    }

    // maxFeePercentage, borrowAmount, upperHint, lowerHint, extraParams
    try {
        //       const data ={
        //   maxFeePercentage: '1000000000000000000',
        //   aeusdAmount: 1791044776119402985075n,
        //   upperHint: 'ak_A8WVnCuJ7t1DjAJf4y8hJrAEVpt1T9ypG3nNBdbpKmpthGvUm',
        //   lowerHint: 'ak_A8WVnCuJ7t1DjAJf4y8hJrAEVpt1T9ypG3nNBdbpKmpthGvUm',
        //   extraParams: {
        //     onAccount: AccountMemory {
        //       getNetworkId: [AsyncFunction: getNetworkId],
        //       networkId: undefined,
        //       isGa: false
        //     },
        //     amount: 100000000000000000000n
        //   }
        // }
        const _openTrove =
            await contracts.BorrowerOperations.methods.open_trove(
                "1000000000000000000", // maxFeePercentage.value,
                1791044776119402985075n, //borrowAmount.value,
                upperHint,
                lowerHint,
                {
                    amount: 20000000000000000000n,
                    // gas: 1000000,
                    // ttl: 1000,
                    // onAccount: aeSdk.accounts[ZERO_ADDRESS],
                }
            );

        // const _openTrove =
        // await contracts.BorrowerOperations.methods.open_trove(
        //     maxFeePercentage.value,
        //     borrowAmount.value,
        //     upperHint,
        //     lowerHint,
        //     {
        //         amount,
        //         // gas: 1000000,
        //         // ttl: 1000,
        //         // onAccount: aeSdk.accounts[ZERO_ADDRESS],
        //     }
        // );

        console.info("========================");
        console.info("_openTrove ::", _openTrove);
        console.info("========================");
    } catch (error) {
        console.info("========================");
        console.error("OPEN TROVE ERROR ::", error);
        console.info("========================");
    }

    loadingOpenTrove.value = false;
}

onMounted(() => {
    loadPriceFeed();
    loadBorrowingRate();
    loadBorrowerOperationsInitialData();
    // const encoder = contracts.TroveManager.calldata
    // console.info('========================');
    // console.info('encoder ::', encoder);
    // console.info('========================');
});
</script>
