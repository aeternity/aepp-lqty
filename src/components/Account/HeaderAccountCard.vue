<template>
    <div v-if="activeAccount" class="d-flex align-center px-4">
        <v-chip>
            <v-avatar start>
                <v-img :src="`https://avatars.z52da5wt.xyz/${activeAccount}`" />
            </v-avatar>

            {{ formatAddress(activeAccount) }}
        </v-chip>

        <div class="pl-4">
            {{ aettosToAe(balance) }}
        </div>
    </div>
</template>

<script lang="ts">
import { useAeppSdk, useBalances } from "@/composables";
import { formatAddress, aettosToAe } from "@/utils";

export default {
    name: "HeaderAccountCard",
    setup() {
        const { activeAccount } = useAeppSdk();
        const { balance } = useBalances();

        return {
            balance,
            formatAddress,
            activeAccount,
            aettosToAe,
        };
    },
};

// import useAeSdk from "@/composables/aeSdk";
// import { onMounted, ref } from "vue";
// import { aettosToAe } from "@/utils/numbers";
// const { aeSdk, activeAccount, accounts, onSelectAccount } = useAeSdk();
// const balance = ref(BigInt(0));

// function formatAddress(address: string) {
//     return `${address.slice(0, 7)}...${address.slice(-4)}`;
// }

// async function loadBalance() {
//     balance.value = await aeSdk.getBalance(activeAccount.value);
// }

// onMounted(async () => {
//     loadBalance();
//     setInterval(loadBalance, 5000);
// });
</script>
