<template>
    <div>
        <v-btn @click="checkOracle()"> Check Oracle </v-btn>
    </div>
</template>

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { storeToRefs } from "pinia";
import { useAccounts } from "@/store/accounts";
import { AeSdk, Node, MemoryAccount } from "@aeternity/aepp-sdk";

export default {
    setup() {
        const { getSdk } = useAeppSdk();
        const { activeAccount } = storeToRefs(useAccounts());

        async function checkOracle() {
            const ORACLE_ID =
                "ok_2NRBaMsgSDjZRFw4dU82KCqLa5W7aQdbJAzaFprTpjEGLAzroV";
            const client = await getSdk();
            // const client = new AeSdk({
            //     nodes: [
            //         {
            //             name: "ae_uat",
            //             instance: new Node("https://mainnet.aeternity.io"),
            //         },
            //     ],
            // });

            // await client.addAccount(
            //   new MemoryAccount({
            //     keypair: {
            //       publicKey: 'ak_fUq2NesPXcYZ1CcqBcGC3StpdnQw3iVxMA3YSeCNAwfN4myQk',
            //       secretKey: '7c6e602a94f30e4ea7edabe4376314f69ba7eaa2f355ecedb339df847b6f0d80575f81ffb0a297b7725dc671da0b1769b1fc5cbe45385c7b5ad1fc2eaf1d609d',
            //     },
            //   }),
            //   {
            //     select: true,
            //   }
            // );

            console.log("client ::", client);

            const oracle = await client.getOracleObject(ORACLE_ID);

            console.info(
                "oracle ::",
                oracle
            );

            console.info(
                "querries ::",
                oracle.queries
            );

            oracle.queries.forEach(async (_query) => {

              const response = await client.pollForQueryResponse(ORACLE_ID, _query.id, { attempts: 10, interval: 6000 })

                console.info(
                    "query decode::",
                    response
                );
            });
            // fetches query data, and charges users with fee
            // const query = await oracle.postQuery("usd", {
            //     queryFee: oracle.queryFee,
            // });

            // console.info("========================");
            // console.info("query ::", query);
            // // console.info("query ::", oracle.respondToQuery());
            // console.info("========================");
        }

        return {
            checkOracle,
        };
    },
};
</script>
