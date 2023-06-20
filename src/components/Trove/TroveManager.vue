<template>
    <div class="py-4">
        <div class="mb-8">
            <div v-if="!activeTrove || !activeTrove.coll">
                <OpenTrove />
            </div>
            <div v-else>
                <TrovePosition />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useTroveManager } from "@/composables/troveManager";
import { useAccounts } from "@/store/accounts";
import { watch } from "vue";
import OpenTrove from "./OpenTrove.vue";
import TrovePosition from "./TrovePosition/TrovePosition.vue";

const { loadActiveTrove, activeTrove } = useTroveManager();
const accounts = useAccounts();

watch(
    () => accounts.activeAccount,
    async () => {
        await loadActiveTrove();
    },
    { immediate: true }
);
</script>
