<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-app-bar-nav-icon
                @click="onToggleLeftSideBar()"
            ></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>
            <v-icon icon="mdi-circle-slice-6" />

            <span class="d-none d-md-inline pl-2">AE LQTY (DEMO)</span>
        </v-app-bar-title>

        <v-spacer />

        <HeaderCurrencySelector />
        <WalletConnect />
        <HeaderAccountCard />
        <HeaderAccountBalances />
    </v-app-bar>
</template>

<script lang="ts">
import HeaderAccountCard from "@/components/Account/HeaderAccountCard.vue";
import WalletConnect from "@/components/WalletConnect/WalletConnect.vue";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import HeaderCurrencySelector from "@/components/Common/HeaderCurrencySelector.vue";
import HeaderAccountBalances from "@/components/Account/HeaderAccountBalances.vue";

export default {
    components: {
        HeaderAccountCard,
        WalletConnect,
        HeaderCurrencySelector,
        HeaderAccountBalances,
    },
    setup() {
        const { leftSideBar } = storeToRefs(useAppStore());

        function onToggleLeftSideBar() {
            console.info("========================");
            console.info("onToggleLeftSideBar ::", leftSideBar);
            console.info("========================");

            leftSideBar.value = !leftSideBar?.value;
        }

        return {
            leftSideBar,
            onToggleLeftSideBar,
        };
    },
};
</script>
