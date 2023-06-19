<template>
    <router-view />
</template>

<script lang="ts" setup>
import { useAeppSdk } from "@/composables";
import { onMounted } from "vue";

const { initSdk } = useAeppSdk();

onMounted(async () => {
    await initSdk();
});
</script>
