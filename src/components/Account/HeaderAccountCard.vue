<template>
    <div class="d-flex align-center">
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    {{
                        activeAccount
                            ? formatAddress(activeAccount)
                            : "Select Account"
                    }}
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="(account, index) in accounts"
                    :key="index"
                    :value="index"
                    :disabled="account === activeAccount"
                    @click="onSelectAccount(account)"
                >
                    <v-list-item-title>{{ account }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-chip class="mx-4"> {{ aettosToAe(balance) }} </v-chip>
    </div>
</template>

<script lang="ts" setup>
import useAeSdk from "@/composables/aeSdk";
import { onMounted, ref } from "vue";
import { aettosToAe } from "@/utils/numbers";
const { aeSdk, activeAccount, accounts, onSelectAccount } = useAeSdk();
const balance = ref(BigInt(0));

function formatAddress(address: string) {
    return `${address.slice(0, 7)}...${address.slice(-4)}`;
}

async function loadBalance() {
    balance.value = await aeSdk.getBalance(activeAccount.value);
}

onMounted(async () => {
    loadBalance();
    setInterval(loadBalance, 5000);
});
</script>
