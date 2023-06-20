<template>
    <v-app-bar>
        <v-app-bar-title>
            <v-icon icon="mdi-circle-slice-6" />

            AE LQTY (DEMO)
        </v-app-bar-title>

        <v-spacer />
        <div>
          (Only Testnet is supported)
        </div>
        <WalletConnect />
        <HeaderAccountCard />
    </v-app-bar>
</template>

<script lang="ts" setup>
import HeaderAccountCard from "@/components/Account/HeaderAccountCard.vue";
import WalletConnect from "@/components/WalletConnect/WalletConnect.vue";
</script>
