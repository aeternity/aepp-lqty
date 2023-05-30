<template>
    <div v-if="loadingContracts" class="text-center pt-12">
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
import { onMounted } from "vue";
import { useLqty } from "./composables/lqty";

const { preloadContracts, loadingContracts } = useLqty();

onMounted(() => {
    preloadContracts();
});
</script>
