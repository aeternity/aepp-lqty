<template>
    <v-app-bar>
        <template v-slot:prepend v-if="!smAndDown">
            <v-app-bar-nav-icon
                @click="onToggleLeftSideBar()"
            ></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>
            <v-icon icon="mdi-circle-slice-6" />

            <span class="d-none d-md-inline pl-2">AE LQTY (DEMO)</span>
        </v-app-bar-title>

        <v-spacer />

        <HeaderCurrencySelector v-if="!smAndDown" />
        <WalletConnect />
        <HeaderAccountCard />
        <HeaderAccountBalances v-if="!smAndDown" />
    </v-app-bar>
</template>

<script lang="ts">
import HeaderAccountCard from "@/components/Account/HeaderAccountCard.vue";
import WalletConnect from "@/components/WalletConnect/WalletConnect.vue";
import { useAppStore } from "@/store/app";
import { storeToRefs } from "pinia";
import HeaderCurrencySelector from "@/components/Common/HeaderCurrencySelector.vue";
import HeaderAccountBalances from "@/components/Account/HeaderAccountBalances.vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

export default {
    components: {
        HeaderAccountCard,
        WalletConnect,
        HeaderCurrencySelector,
        HeaderAccountBalances,
    },
    setup() {
        const { leftSideBar } = storeToRefs(useAppStore());
        const { smAndDown } = useDisplay();

        function onToggleLeftSideBar() {
            console.info("========================");
            console.info("onToggleLeftSideBar ::", leftSideBar);
            console.info("========================");

            leftSideBar.value = !leftSideBar?.value;
        }

        return {
            leftSideBar,
            onToggleLeftSideBar,

            smAndDown,
        };
    },
};
</script>
