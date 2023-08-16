<template>
    <v-card>
        <v-card-title> Stability Pool </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="12">
                    <v-card flat border>
                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <v-card-title>
                                        Your AEUSD Balance
                                    </v-card-title>
                                    <v-card-text>
                                        {{ balance.prettify(2) }}
                                    </v-card-text>
                                </v-col>
                                <v-col cols="6">
                                    <v-card-title>
                                        Your AEUSD Deposit
                                    </v-card-title>
                                    <v-card-text>
                                        {{ compoundedAeusdDeposit.prettify(2) }}
                                    </v-card-text>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card flat border>
                        <v-card-text class="text-center">
                            <div class="text-h6">Your Deposits</div>
                            <div>
                                {{ compoundedAeusdDeposit.prettify(2) }} AEUSD
                            </div>
                        </v-card-text>
                        <v-divider />
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <StabilityPoolPositionManager
                                        v-model="compoundedAeusdDeposit"
                                    />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6">
                    <v-card flat border>
                        <v-card-text class="text-center">
                            <v-row>
                                <v-col cols="6">
                                    <div class="text-h6">Liquidation gain</div>
                                    <div>
                                        {{ depositorAeGain.prettify(2) }} AE
                                    </div>
                                </v-col>

                                <v-col cols="6">
                                    <div class="text-h6">Rewards</div>
                                    <div>
                                        {{ depositorLqtyGain.prettify(2) }} LQTY
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider />
                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <v-btn color="primary" block>
                                        Claim Gains
                                    </v-btn>
                                </v-col>

                                <v-col cols="6">
                                    <v-btn color="primary" block>
                                        Restake Rewards
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { useAccounts } from "@/store/accounts";
import { useBalances } from "@/store/balances";
import { decimalify } from "@/utils";
import { Decimal } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import StabilityPoolPositionManager from "./StabilityPoolPositionManager.vue";

export default {
    components: { StabilityPoolPositionManager },
    setup() {
        const { contracts } = useAeppSdk();
        const { balance } = storeToRefs(useBalances());
        const { activeAccount } = storeToRefs(useAccounts());

        const depositorAeGain = ref<Decimal>(Decimal.ZERO);
        const depositorLqtyGain = ref<Decimal>(Decimal.ZERO);
        const compoundedAeusdDeposit = ref<Decimal>(Decimal.ZERO);

        // withdraw_from_sp, withdraw_ae_gain_to_trove, decrease_aeusd, send_aeusd_to_stability_pool

        async function loadStabilityPoolInfo() {
            const [
                get_depositor_ae_gain,
                get_depositor_lqty_gain,
                get_compounded_aeusd_deposit,
            ] = await Promise.all([
                contracts.StabilityPool.methods
                    .get_depositor_ae_gain(activeAccount.value)
                    .then(decimalify),
                contracts.StabilityPool.methods
                    .get_depositor_lqty_gain(activeAccount.value)
                    .then(decimalify),
                contracts.StabilityPool.methods
                    .get_compounded_aeusd_deposit(activeAccount.value)
                    .then(decimalify),
            ]);

            depositorAeGain.value = get_depositor_ae_gain;
            depositorLqtyGain.value = get_depositor_lqty_gain;
            compoundedAeusdDeposit.value = get_compounded_aeusd_deposit;

            console.info("========================");
            console.info("get_depositor_ae_gain ::", get_depositor_ae_gain);
            console.info("get_depositor_lqty_gain ::", get_depositor_lqty_gain);
            console.info(
                "get_compounded_aeusd_deposit ::",
                get_compounded_aeusd_deposit
            );
            console.info("========================");
        }

        watch(
            activeAccount,
            () => {
                loadStabilityPoolInfo();
            },
            { immediate: true }
        );

        return {
            balance,

            depositorAeGain,
            depositorLqtyGain,
            compoundedAeusdDeposit,
        };
    },
};
</script>
