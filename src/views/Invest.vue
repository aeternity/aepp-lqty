<template>
    <v-row>
        <v-col cols="12">
            <h2>Stake Assets</h2>
        </v-col>
        <v-col cols="12" v-for="(token, index) in ASSETS" :key="index">
            <StakeTokenCard :token="token" />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { ASSETS } from "@/utils";
import StakeTokenCard from "@/components/Staking/StakeTokenCard.vue";

export default {
    components: { StakeTokenCard },
    setup() {
        return {
            ASSETS,
        };
    },
};
</script>
