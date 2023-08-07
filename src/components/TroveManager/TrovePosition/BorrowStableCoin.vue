<template>
    <div>
        <v-dialog v-model="dialogOpen" max-width="500px">
            <v-card>
                <v-card-title> Borrow {{ AEUSD_TOKEN.symbol }} </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            class="mb-4"
                            outline
                            label="Amount"
                            type="number"
                            v-model="amount"
                            :suffix="AEUSD_TOKEN.symbol"
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

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { useStableToken } from "@/composables/stableToken";
import { useTroveManager } from "@/composables/troveManager";
import { useAccounts } from "@/store/accounts";
import { useTokens } from "@/store/tokens";
import { Decimal } from "@liquity/lib-base";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export default {
    setup() {
        const { AEUSD_TOKEN } = storeToRefs(useTokens());

        const dialogOpen = ref(false);
        const amount = ref(0);
        const error = ref("");

        const accounts = useAccounts();
        const { contracts, onAccount } = useAeppSdk();
        const { loadActiveTrove } = useTroveManager();
        const { loadAccountStableTokenBalance } = useStableToken();

        const loadingBorrow = ref(false);

        async function borrow() {
            error.value = "";
            loadingBorrow.value = true;
            try {
                await contracts.BorrowerOperations.methods.withdraw_aeusd(
                    Decimal.from(1).bigNumber,
                    Decimal.from(amount.value).bigNumber,
                    accounts.activeAccount,
                    accounts.activeAccount,
                    {
                        onAccount: onAccount(),
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

        return {
            dialogOpen,
            amount,
            error,
            loadingBorrow,
            borrow,
            openDialog,

            AEUSD_TOKEN,
        };
    },
};
</script>
