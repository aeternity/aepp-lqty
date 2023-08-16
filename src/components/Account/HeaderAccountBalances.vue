
<template>
    <div class="d-flex">
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
export default {
    setup() {
        const { balances } = storeToRefs(useBalances());

        return {
            balances,
        };
    },
};
</script>
