<template>
    <v-row>
        <v-col cols="12" md="12">
            <SystemStatsCard :show-protocol-stats="false"/>
        </v-col>
        <v-col cols="12" md="6">
            <h2>Stability Pool</h2>
            <v-card>
                <v-card-text>
                    <v-alert
                        v-if="error"
                        class="mb-4"
                        color="error"
                        title="Oops, Something went wrong!"
                        :text="error"
                    ></v-alert>
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
        </v-col>
    </v-row>
</template>

<script lang="ts">
import InputAmount from "@/components/Forms/InputAmount.vue";
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";

import { useAeppSdk } from "@/composables";
import { useAccounts } from "@/store/accounts";
import { useBalances } from "@/store/balances";
import { Decimal } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useLiquityStore } from '@/store/liquityStore';

export default {
    components: { InputAmount, SystemStatsCard },
    setup() {
        const { contracts, onAccount } = useAeppSdk();
        const { activeAccount } = storeToRefs(useAccounts());
        const { balance } = storeToRefs(useBalances());
        const { preloadInitialData } = useLiquityStore();

        const stakeAmount = ref<Decimal>(Decimal.ZERO);
        const loading = ref<boolean>(false);
        const error = ref<string | undefined>(undefined);

        // withdraw_from_sp, withdraw_ae_gain_to_trove, decrease_aeusd, send_aeusd_to_stability_pool

        async function loadStabilityPoolInfo() {
            const [get_depositor_ae_gain] = await Promise.all([
                contracts.StabilityPool.methods.get_depositor_ae_gain(
                    activeAccount.value
                ),
            ]);

            console.info("========================");
            console.info("get_depositor_ae_gain ::", get_depositor_ae_gain);
            console.info("========================");
        }

        // TODO: check with Ernesto
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
                preloadInitialData()
            } catch (_error: any) {
                error.value = _error.message;
            }
            loading.value = false;
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
        };
    },
};
</script>
