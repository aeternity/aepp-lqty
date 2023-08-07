<template>
    <v-row>
        <v-col cols="12">
            <h2>Test Screen</h2>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { useBaseLiquity } from "@/store/baseLiquity";
import { useStabilityPool } from "@/store/stabilityPool";
import { onMounted } from "vue";

export default {
    components: {},
    setup() {
        const { loadInitialData } = useStabilityPool();
        const { loadBaseLiquityInitialData } = useBaseLiquity();

        onMounted(() => {
          loadBaseLiquityInitialData();
        });
        return {};
    },
};
</script>
