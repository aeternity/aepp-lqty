<template>
    <v-row>
        <v-col cols="12">
            <AccountOverview />
        </v-col>
        <v-col cols="12">
            <TroveManager />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import AccountOverview from "@/components/Account/AccountOverview.vue";
import TroveManager from "@/components/TroveManager/TroveManager.vue";

export default {
    components: {
        TroveManager,
        AccountOverview,
    },
    setup() {

    },
};
</script>
