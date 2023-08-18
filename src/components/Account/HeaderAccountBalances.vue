
<template>
    <div class="d-flex" v-if="!!activeAccount">
        <div
            v-for="(key, index) of Object.keys(balances)"
            :key="index"
            class="text-center px-2"
        >
            <strong>{{ key }}</strong>
            <div>{{ balances[key].shorten() }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { useBalances } from "@/store/balances";
import { storeToRefs } from "pinia";
import { useAccounts } from "@/store/accounts";
export default {
    setup() {
        const { activeAccount } = storeToRefs(useAccounts());
        const { balances } = storeToRefs(useBalances());

        return {
            activeAccount,
            balances,
        };
    },
};
</script>
