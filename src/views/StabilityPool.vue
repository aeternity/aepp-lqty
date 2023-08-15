<template>
    <v-row>
        <v-col cols="12" md="12">
            <SystemStatsCard :show-protocol-stats="false" />
        </v-col>
        <v-col cols="12" md="6">
            <ProvideTokensToStabilityPool />
        </v-col>
        <v-col cols="12" md="6">
            <WithdrawTokensFromStabilityPool />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";

import ProvideTokensToStabilityPool from "@/components/StabilityPool/ProvideTokensToStabilityPool.vue";
import { useAeppSdk } from "@/composables";
import { useAccounts } from "@/store/accounts";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import WithdrawTokensFromStabilityPool from "@/components/StabilityPool/WithdrawTokensFromStabilityPool.vue";

export default {
    components: {
        SystemStatsCard,
        ProvideTokensToStabilityPool,
        WithdrawTokensFromStabilityPool,
    },
    setup() {
        const { contracts } = useAeppSdk();
        const { activeAccount } = storeToRefs(useAccounts());

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

        onMounted(() => {
            loadStabilityPoolInfo();
        });

        return {};
    },
};
</script>
