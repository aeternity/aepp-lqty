<template>
    <div>
        <v-btn color="primary" @click="registerOracle()">
            Register Oracle
        </v-btn>
        <v-btn @click="loadOraclesQueries()"> Check Oracle v2 </v-btn>

        <pre>
            {{ oracles }}
        </pre>
    </div>
</template>

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { useAccounts } from "@/store/accounts";
import { useOracles } from "@/store/oracles";
import { storeToRefs } from "pinia";

export default {
    setup() {
        const { getSdk } = useAeppSdk();
        const { activeAccount } = storeToRefs(useAccounts());
        const { oracles } = storeToRefs(useOracles());
        const { loadOraclesQueries } = useOracles();

        async function registerOracle() {
            const sdk = await getSdk();

            const options = {
                queryFee: 1337,
                oracleTtl: {
                    type: "block", // 'delta' || 'block'
                    value: 555555,
                },
            };

            const oracle = await sdk.registerOracle("{'city': string}", "{'temperature': int}", options)


            console.info("========================");
            console.info("registerOracle ::", oracle);
            console.info("========================");
        }

        return {
            oracles,
            loadOraclesQueries,
            registerOracle,
        };
    },
};
</script>
