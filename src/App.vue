<template>
    <div v-if="false" class="text-center pt-12">
        <v-progress-circular
            indeterminate
            color="primary"
            class="text-center"
            size="40"
        ></v-progress-circular>
    </div>
    <router-view v-else />
</template>

<script lang="ts" setup>
import { useAeppSdk, useLqty } from "@/composables";
import { onMounted } from "vue";

// const { addAccount } = useAeSdk();
const { preloadContracts, loadingContracts } = useLqty();
const { initSdk } = useAeppSdk();

onMounted(async () => {
    await initSdk();
    // await preloadContracts();
});
</script>
