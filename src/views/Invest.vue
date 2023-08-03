<template>
    <v-row>
        <v-col cols="12">
            <AccountOverview />
        </v-col>
        <v-col cols="12">
            <h2>Staking</h2>
        </v-col>
        <v-col cols="12" v-for="(token, index) in ASSETS" :key="index">
            <StakeTokenCard :token="token" />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import AccountOverview from "@/components/Account/AccountOverview.vue";
import { ASSETS } from "@/utils";
import StakeTokenCard from "@/components/Staking/StakeTokenCard.vue";

export default {
    components: { AccountOverview, StakeTokenCard },
    setup() {
        return {
            ASSETS,
        };
    },
};
</script>
