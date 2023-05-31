<template>
    <div>
        <v-btn color="green" @click="dialogOpen = true"> Transfer </v-btn>

        <v-dialog v-model="dialogOpen" max-width="500px">
            <v-card>
                <v-card-title> Transfer AEUSD </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            class="mb-4"
                            outline
                            label="Recipient"
                            type="text"
                            v-model="recipient"
                        ></v-text-field>
                        <v-text-field
                            label="Amount"
                            type="number"
                            v-model="amount"
                            suffix="AEUSD"
                        ></v-text-field>
                        <v-btn
                            :loading="loadingTransfer"
                            @click.prevent="transfer()"
                            color="primary"
                            block
                        >
                            Transfer
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useLqty } from "@/composables/lqty";

import { decimalsPrefix } from "@/utils/numbers";
import useAeSdk from "@/composables/aeSdk";
import { useStableToken } from "@/composables/stableToken";
const { contracts } = useLqty();
const { activeAccount, aeSdk } = useAeSdk();
const { loadAccountStableTokenBalance } = useStableToken();
const dialogOpen = ref(false);
const amount = ref(0);
const recipient = ref("");
const loadingTransfer = ref(false);

async function transfer() {
    loadingTransfer.value = true;
    try {
        await contracts.AEUSDToken.methods.transfer(
            recipient.value,
            decimalsPrefix(amount.value),
            {
                onAccount: aeSdk.accounts[activeAccount.value],
            }
        );
        await loadAccountStableTokenBalance();
        amount.value = 0;
        dialogOpen.value = false;
    } catch (_error: any) {
        console.error(_error);
    } finally {
        loadingTransfer.value = false;
    }
}
</script>
