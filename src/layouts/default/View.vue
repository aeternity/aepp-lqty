<template>
    <v-main>
        <div class="pa-4">
            <WalletConnectCard />

            <router-view />
        </div>
    </v-main>
</template>

<script lang="ts">
import WalletConnectCard from "@/components/WalletConnect/WalletConnectCard.vue";

export default {
    components: {
        WalletConnectCard,
    },
};
</script>
