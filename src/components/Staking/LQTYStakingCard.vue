<template>
    <v-card>
        <v-card-title> Staking </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" md="6">
                    <LQTYStakingPositionManager v-model="stakedLqty" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-card flat border>
                        <v-card-text class="text-center">
                            <v-row>
                                <v-col cols="6">
                                    <div class="text-h6">Redemption gain</div>
                                    <div>
                                        {{ investorAeGain.prettify(2) }} AE
                                    </div>
                                </v-col>

                                <v-col cols="6">
                                    <div class="text-h6">Issuance gain</div>
                                    <div>
                                        {{ investorAEUSDGain.prettify(2) }}
                                        AEUSD
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-divider />
                        <v-card-text>
                            <v-row>
                                <v-col cols="6">
                                    <v-btn
                                        color="primary"
                                        block
                                        :disabled="investorAeGain.isZero"
                                        :loading="withdrawingAeGains"
                                        @click="onWithdrawAeGains()"
                                    >
                                        Claim Gains
                                    </v-btn>
                                </v-col>

                                <v-col cols="6">
                                    <v-btn color="primary" block disabled>
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
import LQTYStakingPositionManager from "./LQTYStakingPositionManager.vue";

export default {
    components: { LQTYStakingPositionManager },
    setup() {
        const { contracts, onAccount } = useAeppSdk();
        const { balance } = storeToRefs(useBalances());
        const { activeAccount } = storeToRefs(useAccounts());

        const investorAeGain = ref<Decimal>(Decimal.ZERO);
        const investorAEUSDGain = ref<Decimal>(Decimal.ZERO);

        const stakedLqty = ref<Decimal>(Decimal.ZERO);

        async function loadStakingInfo() {
            const [
                total_lqty_staked,
                get_pending_ae_gain,
                get_pending_aeusd_gain,
            ] = await Promise.all([
                contracts.LQTYStaking.methods
                    .total_lqty_staked({
                        onAccount: onAccount(),
                    })
                    .then(decimalify)
                    .catch(() => Decimal.ZERO),
                contracts.LQTYStaking.methods
                    .get_pending_ae_gain(activeAccount.value)
                    .then(decimalify)
                    .catch(() => Decimal.ZERO),
                contracts.LQTYStaking.methods
                    .get_pending_aeusd_gain(activeAccount.value)
                    .then(decimalify)
                    .catch(() => Decimal.ZERO),
            ]);

            stakedLqty.value = total_lqty_staked;
            investorAeGain.value = get_pending_ae_gain;
            investorAEUSDGain.value = get_pending_aeusd_gain;
        }

        const withdrawingAeGains = ref(false);
        async function onWithdrawAeGains() {
            if (withdrawingAeGains.value) return;
            withdrawingAeGains.value = true;

            try {
                const tx =
                    await contracts.StabilityPool.methods.withdraw_ae_gain_to_trove(
                        activeAccount.value,
                        activeAccount.value,
                        {
                            onAccount: onAccount(),
                        }
                    );
                console.info("onWithdrawAeGains tx ::", tx);
            } catch (error) {
                console.error("onWithdrawAeGains->error ::", error);
            }
            withdrawingAeGains.value = false;
        }

        watch(
            activeAccount,
            () => {
                loadStakingInfo();
            },
            { immediate: true }
        );

        return {
            balance,

            investorAeGain,
            investorAEUSDGain,
            stakedLqty,

            onWithdrawAeGains,
            withdrawingAeGains,
        };
    },
};
</script>
