<template>
    <div
        v-if="loadingApp"
        class="d-flex align-center justify-center"
        style="height: 100vh; width: 100vw"
    >
        <div class="text-center">
            <v-progress-circular indeterminate color="primary" size="80" />
        </div>
    </div>
    <router-view v-else />
</template>

<script lang="ts" setup>
import { useAeppSdk } from "@/composables";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useTroveManager } from "./composables/troveManager";
import { useAccounts } from "./store/accounts";
import { useCurrencies } from "./store/currencies";
import { usePriceFeed } from "./store/priceFeed";

const { initSdk, preloadContracts } = useAeppSdk();
const { loadActiveTrove } = useTroveManager();
const { activeAccount } = storeToRefs(useAccounts());
const { loadPriceFeed } = usePriceFeed();
const { loadAeternityData, loadCurrencyRates } = useCurrencies();
const loadingApp = ref(true);

watch(
    () => activeAccount,
    async () => {
        if (!activeAccount.value) return;
        await loadActiveTrove();
    }
);

onMounted(async () => {
    await Promise.all([loadAeternityData(), loadCurrencyRates(), initSdk()]);
    await preloadContracts();
    loadPriceFeed();
    await loadActiveTrove();
    // if there's a connected wallet, retrieve open troves
    loadingApp.value = false;
    setInterval(() => {
        loadPriceFeed();
    }, 1000 * 5);
});
</script>
