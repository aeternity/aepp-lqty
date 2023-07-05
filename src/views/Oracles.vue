<template>
    <div>
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

        return {
            oracles,
            loadOraclesQueries,
        };
    },
};
</script>
