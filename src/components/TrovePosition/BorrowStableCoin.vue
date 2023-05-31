<template>
    <div>
        <v-dialog v-model="dialogOpen" max-width="500px">
            <v-card>
                <v-card-title> Borrow AEUSD </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            class="mb-4"
                            outline
                            label="Amount"
                            type="number"
                            v-model="amount"
                            suffix="AEUSD"
                            :error="!!error"
                            :error-messages="error"
                        ></v-text-field>
                        <v-btn
                            :loading="loadingBorrow"
                            @click.prevent="borrow()"
                            color="primary"
                            block
                        >
                            Borrow
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-btn color="primary" @click="openDialog()"> Borrow </v-btn>
    </div>
</template>

<script lang="ts" setup>
import useAeSdk from "@/composables/aeSdk";
import { useLqty } from "@/composables/lqty";
import { useStableToken } from "@/composables/stableToken";
import { useTroveManager } from "@/composables/troveManager";
import { decimalsPrefix } from "@/utils/numbers";
import { ref } from "vue";
const dialogOpen = ref(false);
const amount = ref(0);
const error = ref("");

const { activeAccount, aeSdk } = useAeSdk();
const { contracts } = useLqty();
const { loadActiveTrove } = useTroveManager();
const { loadAccountStableTokenBalance } = useStableToken();

const loadingBorrow = ref(false);

async function borrow() {
    error.value = "";
    loadingBorrow.value = true;
    try {
        await contracts.BorrowerOperations.methods.withdraw_aeusd(
            "1000000000000000000",
            decimalsPrefix(amount.value),
            activeAccount.value,
            activeAccount.value,
            {
                onAccount: aeSdk.accounts[activeAccount.value],
            }
        );
        await loadActiveTrove();
        await loadAccountStableTokenBalance();
        amount.value = 0;

        dialogOpen.value = false;
    } catch (_error: any) {
        error.value = _error.message;
    }
    loadingBorrow.value = false;
}

function openDialog() {
    dialogOpen.value = true;
}
</script>
