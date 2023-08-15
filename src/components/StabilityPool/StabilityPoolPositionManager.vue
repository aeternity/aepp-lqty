<template>
    <v-card>
        <v-card-title> Stability Pool </v-card-title>
        <v-card-text>
            <v-alert
                v-if="error"
                class="mb-4"
                color="error"
                title="Oops, Something went wrong!"
                :text="error"
            ></v-alert>

            <v-row>
                <v-col cols="6">
                    <v-card-title> Compounded AEUSD Deposit </v-card-title>
                    <v-card-text>
                        {{ compoundedAeusdDeposit.prettify(2) }}
                    </v-card-text>
                </v-col>
                <v-col cols="6">
                    <v-card-title> Depositor AE Gain </v-card-title>
                    <v-card-text>
                        {{ depositorAeGain.prettify(2) }}
                    </v-card-text>
                </v-col>
                <v-col cols="6">
                    <v-card-title> Depositor LQTY Gain </v-card-title>
                    <v-card-text>
                        {{ depositorLqtyGain.prettify(2) }}
                    </v-card-text>
                </v-col>
            </v-row>

            <InputAmount
                v-model="stakeAmount"
                label="Deposit"
                :max-amount="balance"
            />

            <v-btn
                color="primary"
                :loading="loading"
                @click="onProvideAmountToSP()"
            >
                Confirm
            </v-btn>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import InputAmount from "@/components/Forms/InputAmount.vue";

import { useAeppSdk } from "@/composables";
import { useBalances } from "@/store/balances";
import { useLiquityStore } from "@/store/liquityStore";
import { Decimal } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useAccounts } from "@/store/accounts";
import { decimalify } from "@/utils";

export default {
    components: { InputAmount },
    setup() {
        const { contracts, onAccount } = useAeppSdk();
        const { balance } = storeToRefs(useBalances());
        const { preloadInitialData } = useLiquityStore();
        const { activeAccount } = storeToRefs(useAccounts());

        const stakeAmount = ref<Decimal>(Decimal.ZERO);
        const loading = ref<boolean>(false);
        const error = ref<string | undefined>(undefined);

        const depositorAeGain = ref<Decimal>(Decimal.ZERO);
        const depositorLqtyGain = ref<Decimal>(Decimal.ZERO);
        const compoundedAeusdDeposit = ref<Decimal>(Decimal.ZERO);

        // TODO: show pool share
        async function onProvideAmountToSP() {
            error.value = undefined;
            loading.value = true;

            const frontEnd = null;
            try {
                await contracts.StabilityPool.methods.provide_to_sp(
                    stakeAmount.value.bigNumber,
                    frontEnd,
                    {
                        onAccount: onAccount(),
                    }
                );
                stakeAmount.value = Decimal.ZERO;
                preloadInitialData();
                loadStabilityPoolInfo();
            } catch (_error: any) {
                error.value = _error.message;
            }
            loading.value = false;
        }

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

        onMounted(() => {
            loadStabilityPoolInfo();
        });

        return {
            stakeAmount,
            onProvideAmountToSP,

            error,
            loading,
            balance,

            depositorAeGain,
            depositorLqtyGain,
            compoundedAeusdDeposit,
        };
    },
};
</script>
