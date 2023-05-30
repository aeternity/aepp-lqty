<template>
    <div v-if="account" class="pa-2 d-flex align-center">
        <v-chip>
            {{ formatAddress(account) }}
        </v-chip>

        <div class="pl-4">
            {{ aettosToAe(balance) }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import useAeSdk from "@/composables/aeSdk";
import { onMounted, ref } from "vue";
import { aettosToAe } from "@/utils/numbers";
const { aeSdk } = useAeSdk();
const account = ref();
const balance = ref(BigInt(0));

function formatAddress(address: string) {
    return `${address.slice(0, 7)}...${address.slice(-4)}`;
}

async function loadBalance() {
    balance.value = await aeSdk.getBalance(account.value);
}

onMounted(async () => {
    account.value = Object.keys(aeSdk.accounts)[0];

    loadBalance();
});
</script>
