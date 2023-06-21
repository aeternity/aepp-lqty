<template>
    <v-app-bar>
        <v-app-bar-title>
            <v-icon icon="mdi-circle-slice-6" />

            AE LQTY (DEMO)
        </v-app-bar-title>

        <v-spacer />

        <WalletConnect />
        <HeaderAccountCard />
    </v-app-bar>
</template>

<script lang="ts">
import HeaderAccountCard from "@/components/Account/HeaderAccountCard.vue";
import WalletConnect from "@/components/WalletConnect/WalletConnect.vue";

export default {
    components: {
        HeaderAccountCard,
        WalletConnect,
    },
};
</script>
