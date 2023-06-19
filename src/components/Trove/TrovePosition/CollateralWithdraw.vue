<template>
    <div>
        <v-dialog v-model="dialogOpen" max-width="500px">
            <v-card>
                <v-card-title> Withdraw AE </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            class="mb-4"
                            outline
                            label="Amount"
                            type="number"
                            v-model="amount"
                            suffix="AE"
                            :error="!!error"
                            :error-messages="error"
                        ></v-text-field>
                        <v-btn
                            :loading="loadingWithdraw"
                            @click.prevent="withdraw()"
                            color="primary"
                            block
                        >
                            Withdraw
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-btn color="primary" @click="openDialog()"> Withdraw</v-btn>
    </div>
</template>

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { useTroveManager } from "@/composables/troveManager";
import { useAccounts } from "@/store/accounts";
import { decimalsPrefix } from "@/utils/numbers";
import { ref } from "vue";

export default {
    setup() {
        const dialogOpen = ref(false);
        const amount = ref(0);
        const error = ref("");

        const accounts = useAccounts();
        const { contracts, onAccount } = useAeppSdk();
        const { loadActiveTrove } = useTroveManager();

        const loadingWithdraw = ref(false);

        async function withdraw() {
            error.value = "";
            loadingWithdraw.value = true;
            try {
                await contracts.BorrowerOperations.methods.withdraw_coll(
                    decimalsPrefix(amount.value),
                    accounts.activeAccount,
                    accounts.activeAccount,
                    {
                        onAccount: onAccount(),
                    }
                );
                await loadActiveTrove();
                amount.value = 0;

                dialogOpen.value = false;
            } catch (_error: any) {
                error.value = _error.message;
            }
            loadingWithdraw.value = false;
        }

        function openDialog() {
            dialogOpen.value = true;
        }

        return {
            dialogOpen,
            amount,
            error,
            loadingWithdraw,
            withdraw,
            openDialog,
        };
    },
};
</script>

