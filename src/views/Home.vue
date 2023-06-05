<template>
    <div>
        <div v-if="contractsLoaded">
            <account-overview />
            <account-positions />
        </div>
        <div>
            <v-btn
                v-if="activeAccount"
                color="primary"
                @click="preloadContracts()"
                :loading="loadingContracts"
                >Load Contracts</v-btn
            >
        </div>

        <pre>
          {{ activeAccount }}
        </pre>
    </div>
</template>

<script lang="ts" setup>
import AccountOverview from "@/components/AccountOverview.vue";
import AccountPositions from "@/components/AccountPositions.vue";
import { onMounted } from "vue";
import { useAeppSdk, useLqty } from "@/composables";

const { aeSdk, activeAccount } = useAeppSdk();
const { contracts, contractsLoaded, loadingContracts, preloadContracts } =
    useLqty();

onMounted(async () => {
    console.log("===========");
    console.log("contracts:: ", contracts);
    console.log("===========");

    // const accounts = aeSdk.accounts;
    // console.info("========================");
    // console.info("accounts ::", accounts);
    // console.info("========================");

    // const balance = await aeSdk.getBalance(
    //     "ak_f9bmi44rdvUGKDsTLp3vMCMLMvvqsMQVWyc3XDAYECmCXEbzy"
    // );

    // console.info("========================");
    // console.info("balance ::", balance);
    // console.info("========================");
});
</script>
