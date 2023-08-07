<template>
    <v-row>
        <v-col cols="12" md="12">
            <h2>Stability Pool</h2>
            <v-card>
                <v-card-text>
                    <AmountInput
                        v-model="stakeAmount"
                        label="Deposit"
                        suffix="AEUSD"
                    />

                    <v-btn color="primary" @click="onStakeAmount()"> Confirm </v-btn>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import AmountInput from "@/components/Forms/AmountInput.vue";
import { Decimal } from "@liquity/lib-base";
import { ref } from "vue";
import { useStabilityPool } from "@/store/stabilityPool";

export default {
    components: { AmountInput },
    setup() {
        const { provideToSP } = useStabilityPool();
        const stakeAmount = ref<Decimal>(Decimal.ZERO);

        // TODO: check with Ernesto
        async function onStakeAmount() {
            try {
              await provideToSP(stakeAmount.value);
            } catch (error) {
              console.info('========================');
              console.info('error ::', error);
              console.info('========================');

            }
        }
        return {
            stakeAmount,
            onStakeAmount,
        };
    },
};
</script>
