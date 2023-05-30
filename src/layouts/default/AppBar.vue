<template>
    <v-app-bar>
        <v-app-bar-title>
            <v-icon icon="mdi-circle-slice-6" />

            AE LQTY (DEMO)
        </v-app-bar-title>

        <v-spacer />
        <header-account-card />
    </v-app-bar>
</template>

<script lang="ts" setup>
import HeaderAccountCard from "@/components/Account/HeaderAccountCard.vue";
</script>
