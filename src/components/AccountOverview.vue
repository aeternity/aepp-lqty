<template>
    <v-row>
        <v-col cols="12">
            <h2>Overview</h2>
        </v-col>
        <v-col cols="6">
            <v-card>
                <v-card-title>
                    {{ numberFormat(activeAccountStableTokenBalance) }}
                </v-card-title>
                <v-card-text class="d-flex align-center justify-space-between">
                  <div>
                    AEUSD
                  </div>
                  <transfer-stable-token />
                </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card>
                <v-card-title> TODO </v-card-title>
                <v-card-text> Borrow Fee </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card>
                <v-card-title> TODO </v-card-title>
                <v-card-text> D / C (%) </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card>
                <v-card-title> TODO </v-card-title>
                <v-card-text> Liquidation (AE) </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { useStableToken } from "@/composables/stableToken";
import TransferStableToken from "./Exchange/TransferStableToken.vue";
import { aettosToAe, numberFormat } from "@/utils/numbers";

const { activeAccountStableTokenBalance } = useStableToken();
</script>
