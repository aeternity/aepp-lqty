<template>
    <v-row>
        <v-col cols="12" md="12">
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
                    <AmountInput
                        v-model="stakeAmount"
                        label="Deposit"
                        suffix="AEUSD"
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
import AmountInput from "@/components/Forms/AmountInput.vue";
import { useAeppSdk } from "@/composables";
import { Decimal } from "@liquity/lib-base";
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { useAccounts } from '@/store/accounts';

export default {
    components: { AmountInput },
    setup() {
        const { contracts, onAccount } = useAeppSdk();
        const { activeAccount } = storeToRefs(useAccounts())
        const stakeAmount = ref<Decimal>(Decimal.ZERO);
        const loading = ref<boolean>(false);
        const error = ref<string | undefined>(undefined);

        // TODO: check with Ernesto
        async function onProvideAmountToSP() {
            error.value = undefined;
            loading.value = true;

            const frontEnd = 'ak_LF4siZQxMqjGBAcHS2MMacMYgYjHjRh4HkDwqF3sA59oLfcMA';
            // try {
            //   await contracts.StabilityPool.methods.register_front_end(
            //     5,
            //     {
            //       onAccount: onAccount(),
            //     }
            //   )
            // } catch (newError) {
            //   console.info('========================');
            //   console.info('newError ::', newError);
            //   console.info('========================');

            // }


            try {
                await contracts.StabilityPool.methods.provide_to_sp(
                    stakeAmount.value.bigNumber,
                    frontEnd,
                    {
                      onAccount: onAccount(),
                    }
                );
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
        };
    },
};
</script>
