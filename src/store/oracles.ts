// Utilities
import { useAeppSdk } from "@/composables";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Oracle {
  name: string;
  queries: [];
}

export const useOracles = defineStore(
  "oracles",
  () => {
    // each network should have its own oracles
    const { getSdk, onAccount } = useAeppSdk();
    const oracles = ref<Record<`ok_${string}`, Oracle>>({
      ok_2NRBaMsgSDjZRFw4dU82KCqLa5W7aQdbJAzaFprTpjEGLAzroV: {
        name: "Price Feed",
        queries: [],
      },
    });

    async function loadOraclesQueries() {
      console.info("========================");
      console.info("loadOraclesQueries ::", Object.keys(oracles.value));
      console.info("========================");

      const aeSdk = await getSdk();
      Object.keys(oracles.value).forEach(async (oracleAddress: any) => {
        const oracle = await aeSdk.getOracleObject(oracleAddress);
        console.info("oracle ::", oracle);
        // if (!oracle) return;
        const freeQuery = await oracle.postQuery("usd", {
          queryFee: 0,
          onAccount: onAccount(),
        });
        console.info("freeQuery ::", freeQuery);

        if (!oracle.queries?.length) {
          const query = await oracle.postQuery("usd", {
            queryFee: oracle.queryFee,
            onAccount: onAccount(),
          });
          console.info("query ::", query);
        } else {
          console.info("========================");
          console.info("found queries ::", oracle.queries);
          console.info("========================");
          oracle.queries.forEach(async (query) => {
            const response = await aeSdk.pollForQueryResponse(
              oracleAddress,
              query.id,
              { attempts: 10, interval: 6000 }
            );

            console.info("query decode::", response);
          });
        }
      });
      //
    }

    // onMounted(() => {
    //   loadBalance();

    //   setInterval(() => {
    //     loadBalance();
    //   }, 5000);
    // });

    return {
      oracles,
      loadOraclesQueries,
    };
  },
  { persist: true }
);
