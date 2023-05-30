<template>
    <div class="py-4">
        <div class="mb-8">
            <div v-if="!activeTrove">
                <v-alert color="warning"> Not Troves Found!! </v-alert>
                <open-trove />
            </div>
            <div v-else>
                <trove-position />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import { useTroveManager } from "@/composables/troveManager";

import OpenTrove from "./OpenTrove.vue";
import TrovePosition from "../TrovePosition/TrovePosition.vue";

const { loadActiveTrove, activeTrove } = useTroveManager();

onMounted(() => {
    loadActiveTrove();
});
</script>
