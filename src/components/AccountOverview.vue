<template>
    <v-row>
        <v-col cols="12">
            <h2>Overview</h2>
        </v-col>
        <v-col cols="6">
            <v-card>
                <v-card-title>
                    {{ activeAccountStableTokenBalance }}
                </v-card-title>
                <v-card-text> AEUSD </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card>
                <v-card-title> 0.12% </v-card-title>
                <v-card-text> Borrow Fee </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card>
                <v-card-title> 1.12% </v-card-title>
                <v-card-text> D / C (%) </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card>
                <v-card-title> $12.25 / $1,226.44 </v-card-title>
                <v-card-text> Liquidation (AE) </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { useStableToken } from "@/composables/stableToken";

const { activeAccountStableTokenBalance } = useStableToken();
</script>
