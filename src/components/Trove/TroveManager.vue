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
import { watch } from "vue";
import { useAeppSdk } from "@/composables";

const { loadActiveTrove, activeTrove } = useTroveManager();
const { activeAccount } = useAeppSdk();

watch(
    activeAccount,
    async () => {
        await loadActiveTrove();
    },
    { immediate: true }
);
</script>
