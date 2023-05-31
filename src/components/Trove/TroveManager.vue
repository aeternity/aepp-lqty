<template>
    <div class="py-4">
        <div class="mb-8">
            <div v-if="!activeTrove || !activeTrove.coll">
                <open-trove />
            </div>
            <div v-else>
                <trove-position />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { useTroveManager } from "@/composables/troveManager";
import OpenTrove from "./OpenTrove.vue";
import TrovePosition from "../TrovePosition/TrovePosition.vue";
import useAeSdk from "@/composables/aeSdk";
import { watch } from "vue";

const { loadActiveTrove, activeTrove } = useTroveManager();
const { activeAccount } = useAeSdk();

watch(activeAccount, async () => {
    await loadActiveTrove();
}, { immediate: true });

</script>
