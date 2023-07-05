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
import { onMounted, ref } from "vue";

const { initSdk, preloadContracts } = useAeppSdk();

const loadingApp = ref(true);

onMounted(async () => {
    await initSdk();
    await preloadContracts();
    loadingApp.value = false;
});
</script>
