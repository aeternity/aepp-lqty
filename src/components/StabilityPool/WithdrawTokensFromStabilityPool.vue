<template>
  <v-card>
    <v-card-title> Withdraw Tokens From Stability Pool </v-card-title>
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
            label="Amount to withdraw"
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
import { ref } from "vue";

export default {
    components: { InputAmount },
    setup() {
        const { contracts, onAccount } = useAeppSdk();
        const { balance } = storeToRefs(useBalances());
        const { preloadInitialData } = useLiquityStore();

        const stakeAmount = ref<Decimal>(Decimal.ZERO);
        const loading = ref<boolean>(false);
        const error = ref<string | undefined>(undefined);

        // TODO: fetch current deposited amount in SP

        async function onProvideAmountToSP() {
            error.value = undefined;
            loading.value = true;
            try {
                await contracts.StabilityPool.methods.withdraw_from_sp(
                    stakeAmount.value.bigNumber,
                    {
                        onAccount: onAccount(),
                    }
                );
                stakeAmount.value = Decimal.ZERO;
                preloadInitialData();
            } catch (_error: any) {
                error.value = _error.message;
            }
            loading.value = false;
        }

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
