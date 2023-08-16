<template>
    <div>
        <v-card flat border>
            <v-card-text class="text-center">
                <v-row>
                    <v-col cols="6">
                        <div class="text-h6">Your Stakes</div>
                        <div>{{ modelValue.prettify(2) }} LQTY</div>
                    </v-col>

                    <v-col cols="6">
                        <div class="text-h6">Pool share</div>
                        <div>
                            {{
                                originalPoolShare.infinite
                                    ? "N/A"
                                    : originalPoolShare.prettify(4).concat("%")
                            }}
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider />
            <v-card-text>
                <v-btn color="primary" block @click="onOpenDialog()">
                    {{ hasDeposit ? "Adjust" : "Stake" }}
                </v-btn>
            </v-card-text>
        </v-card>

        <v-dialog v-model="showDialog" max-width="500px" persistent>
            <v-card>
                <v-card-title>
                    {{ hasDeposit ? "Adjust Position" : "Stake" }}
                </v-card-title>

                <v-card-text>
                    <v-alert
                        v-if="error"
                        class="mb-4"
                        color="error"
                        title="Oops, Something went wrong!"
                        :text="error"
                    ></v-alert>
                    <InputAmount
                        v-model="deposit"
                        label="Stake"
                        :max-amount="lqtyBalance.add(deposit.toString())"
                        suffix="LQTY"
                    />

                    <div class="pb-2">
                        <span>
                            Pool share:
                            {{
                                newPoolShare.infinite
                                    ? "N/A"
                                    : newPoolShare.prettify(4).concat("%")
                            }}
                        </span>
                        <small
                            v-if="poolShareChange?.nonZero"
                            :class="{
                                'text-green': poolShareChange?.positive,
                                'text-red': !poolShareChange?.positive,
                            }"
                        >
                            ({{ poolShareChange?.prettify(4).concat("%") }})
                        </small>
                    </div>

                    <v-alert
                        class="mt-4"
                        icon="mdi-information"
                        border="start"
                        variant="tonal"
                        outline
                        :color="stakingActionColor"
                        :text="stakingActionMessage"
                    ></v-alert>
                </v-card-text>
                <v-card-text class="d-flex justify-space-between">
                    <v-btn
                        color="primary"
                        size="large"
                        variant="outlined"
                        :disabled="loading"
                        @click="onCloseDialog()"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="primary"
                        size="large"
                        :loading="loading"
                        @click="onAdjustPosition()"
                    >
                        Confirm
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import InputAmount from "@/components/Forms/InputAmount.vue";
import { useAeppSdk } from "@/composables";
import { useBalances } from "@/store/balances";
import { useLiquityStore } from "@/store/liquityStore";
import { Decimal, Difference } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { computed, PropType, ref } from "vue";

export default {
    props: {
        modelValue: {
            type: Object as PropType<Decimal>,
            default: () => Decimal.ZERO,
        },
    },
    emits: ["update:modelValue"],
    components: {
        InputAmount,
    },
    setup(props, { emit }) {
        const { lqtyBalance } = storeToRefs(useBalances());
        const { contracts, onAccount } = useAeppSdk();
        const { preloadInitialData } = useLiquityStore();
        const {
            totalStakedLQTY,
            // kickbackRate, //
        } = storeToRefs(useLiquityStore());

        const showDialog = ref(false);
        const deposit = ref(Decimal.ZERO);
        const loading = ref<boolean>(false);
        const error = ref<string | undefined>(undefined);

        const totalStakedLQTYAfterChange = computed(() =>
            totalStakedLQTY.value
                .sub(props.modelValue)
                .add(deposit.value.toString())
        );

        const originalPoolShare = computed(() =>
            props.modelValue.mulDiv(100, totalStakedLQTY.value.toString())
        );
        const newPoolShare = computed(() =>
            deposit.value.mulDiv(100, totalStakedLQTYAfterChange.value)
        );

        const poolShareChange = computed(
            () =>
                props.modelValue.nonZero &&
                Difference.between(newPoolShare.value, originalPoolShare.value)
                    .nonZero
        );

        const hasDeposit = computed<boolean>(() =>
            props.modelValue.gt(Decimal.ZERO)
        );

        const stakingActionMessage = computed(() =>
            deposit.value.eq(props.modelValue)
                ? `Enter the amount of LQTY you'd like to stake.`
                : deposit.value.gt(props.modelValue)
                ? `You are staking ${deposit.value.sub(props.modelValue)} LQTY.`
                : `You are unstaking ${props.modelValue.sub(
                      deposit.value.toString()
                  )} LQTY.`
        );

        const stakingActionColor = computed(() => "info");

        function onOpenDialog() {
            showDialog.value = true;
            deposit.value = props.modelValue;
        }

        function onCloseDialog() {
            showDialog.value = false;
        }

        async function onAdjustPosition() {
            loading.value = true;
            error.value = undefined;

            if (hasDeposit.value && deposit.value.gt(props.modelValue)) {
                await onStake(deposit.value.sub(props.modelValue));
            } else if (hasDeposit.value && deposit.value.lt(props.modelValue)) {
                await onUnStake(props.modelValue.sub(deposit.value.toString()));
            } else if (!hasDeposit.value) {
                await onStake(deposit.value);
            } else {
                error.value = "Something went wrong";
            }
            loading.value = false;

            emit("update:modelValue", deposit.value);

            preloadInitialData();
        }

        async function onStake(amount: Decimal) {
            try {
                await contracts.LQTYStaking.methods.stake(amount.bigNumber, {
                    onAccount: onAccount(),
                });
                onCloseDialog();
            } catch (_error: any) {
                console.info("onStake->error ::", _error);
                error.value = _error.message;
            }
        }

        async function onUnStake(amount: Decimal) {
            try {
                await contracts.LQTYStaking.methods.unstake(amount.bigNumber, {
                    onAccount: onAccount(),
                });
                onCloseDialog();
            } catch (_error: any) {
                console.info("onUnStake->error ::", _error);
                error.value = _error.message;
            }
        }

        return {
            lqtyBalance,
            hasDeposit,

            showDialog,
            onOpenDialog,
            onCloseDialog,

            onAdjustPosition,

            deposit,
            loading,
            error,

            stakingActionMessage,
            stakingActionColor,

            originalPoolShare,
            newPoolShare,
            poolShareChange,
        };
    },
};
</script>
