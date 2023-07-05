<template>
    <div>
        <v-btn @click="checkOracle()"> Check Oracle </v-btn>
    </div>
</template>

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { storeToRefs } from 'pinia';
import { useAccounts } from '@/store/accounts';

export default {
    setup() {
        const { getSdk } = useAeppSdk();
        const { activeAccount } = storeToRefs(useAccounts());

        async function checkOracle() {
            const ORACLE_ID =
                "ok_2NRBaMsgSDjZRFw4dU82KCqLa5W7aQdbJAzaFprTpjEGLAzroV";
            const sdk = await getSdk();
            const oracle = await sdk.getOracleObject(ORACLE_ID, {
              onAccount: activeAccount.value,
            });

            console.info("respondToQuery ::", oracle.respondToQuery({
              onAccount: activeAccount.value,
            }));
            const query = await oracle.postQuery("eur", {
                queryFee: oracle.queryFee,
            });

            console.info("========================");
            console.info("query ::", query);
            console.info("query ::", oracle.respondToQuery());
            console.info("========================");
        }

        return {
            checkOracle,
        };
    },
};
</script>
