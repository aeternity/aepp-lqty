<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="6" md="3" class="d-flex align-center">
                    <v-avatar start size="24">
                        <v-img
                            :src="`https://avatars.z52da5wt.xyz/${token.contractAddress}`"
                        />
                    </v-avatar>
                    <div class="text-h6 pl-2">
                        {{ token.symbol }}
                    </div>
                </v-col>
                <v-col cols="6" md="3">
                    <div>Max Slashing</div>
                    <div>33.00%</div>
                </v-col>

                <v-col cols="6" md="3">
                    <div>Wallet Balance</div>
                    <div>6.33%</div>
                </v-col>

                <v-col cols="6" md="3">
                    <v-btn color="primary" @click="openStakeDialog()"
                        >Stake</v-btn
                    >
                </v-col>
            </v-row>
        </v-card-text>

        <v-dialog v-model="stakeDialog" max-width="450px">
            <v-card>
                <v-card-title> Stake {{ token.symbol }} </v-card-title>
                <v-card-text>
                    <v-alert
                        v-if="error"
                        class="mb-4"
                        color="error"
                        title="Oops, Something went wrong!"
                        :text="error"
                    ></v-alert>
                    <AmountInput
                        v-model="stakeAmount"
                        label="Amount"
                        :suffix="token.symbol"
                    />
                    {{ currentAllowance.prettify(2) }}
                    <v-btn
                        block
                        color="primary"
                        :loading="creatingAllowanceForStaking"
                        :disabled="hasAllowanceForStaking"
                        @click="onCreateAllowanceForStaking()"
                    >
                        {{
                            hasAllowanceForStaking
                                ? "Allowance Created"
                                : creatingAllowanceForStaking
                                ? "Creating Allowance..."
                                : "Create Allowance"
                        }}
                    </v-btn>
                    <v-btn
                        block
                        color="primary"
                        class="mt-2"
                        :loading="staking"
                        @click="onStake()"
                    >
                        Stake
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script lang="ts">
import AmountInput from "@/components/Forms/AmountInput.vue";
import { useAeppSdk } from "@/composables";
import { useAccounts } from "@/store/accounts";
import { Decimal } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

export default {
    props: {
        token: {
            type: Object,
            required: true,
        },
    },
    components: {
        AmountInput,
    },
    setup() {
        const { contracts, onAccount } = useAeppSdk();
        const { activeAccount } = storeToRefs(useAccounts());

        const stakeDialog = ref(false);
        function openStakeDialog() {
            stakeDialog.value = true;
        }

        // stake dialog methods
        const stakeAmount = ref<Decimal>(Decimal.ZERO);
        const error = ref<string>();
        const currentAllowance = ref<Decimal>(Decimal.ZERO);
        const hasAllowanceForStaking = computed<boolean>(() =>
            currentAllowance.value.gte(stakeAmount.value.toString())
        );
        const creatingAllowanceForStaking = ref(false);
        const staking = ref(false);

        async function loadCurrentAllowance() {
            currentAllowance.value = Decimal.fromBigNumberString(
                (
                    await contracts.LQTYToken.methods.allowance({
                        from_account: activeAccount.value,
                        for_account: activeAccount.value,
                    })
                ).decodedResult
            );
        }

        onMounted(async () => {
            await loadCurrentAllowance();
        });

        async function onCreateAllowanceForStaking() {
            creatingAllowanceForStaking.value = true;
            error.value = undefined;
            try {
                if (currentAllowance.value.gt(Decimal.ZERO)) {
                    const amount = stakeAmount.value.sub(
                        currentAllowance.value.toString()
                    );
                    await contracts.LQTYToken.methods.change_allowance(
                        activeAccount.value,
                        amount.bigNumber,
                        {
                            onAccount: onAccount(),
                        }
                    );
                } else {
                    await contracts.LQTYToken.methods.create_allowance(
                        activeAccount.value,
                        stakeAmount.value.bigNumber,
                        {
                            onAccount: onAccount(),
                        }
                    );
                }
                await loadCurrentAllowance();
            } catch (_error: any) {
                error.value = _error.message;
            }

            creatingAllowanceForStaking.value = false;
        }

        async function onStake() {
            staking.value = true;
            error.value = undefined;
            try {
                const result =
                    await contracts.StabilityPool.methods.provide_to_sp(
                        stakeAmount.value.bigNumber,
                        null,
                        // activeAccount.value,
                        {
                            onAccount: onAccount(),
                        }
                    );

                console.info("onStake:: ::", result);
            } catch (_error: any) {
                error.value = _error.message;
            }

            staking.value = false;
        }

        return {
            stakeDialog,

            openStakeDialog,

            // dialog methods and data
            error,
            stakeAmount,
            hasAllowanceForStaking,
            creatingAllowanceForStaking,
            onCreateAllowanceForStaking,

            staking,
            onStake,

            currentAllowance,
        };
    },
};
</script>
