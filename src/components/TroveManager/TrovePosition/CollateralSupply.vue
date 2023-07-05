<template>
    <div>
        <v-btn color="primary" @click="openDialog()"> Supply </v-btn>
        <v-dialog v-model="dialogOpen" max-width="600px" z-index="">
            <v-card>
                <v-card-title> Supply AE </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            outline
                            label="Amount"
                            type="number"
                            v-model="amount"
                            suffix="AE"
                        ></v-text-field>
                        <v-btn
                            :loading="loadingSupply"
                            @click.prevent="supply()"
                            color="primary"
                            block
                        >
                            Supply
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { useTroveManager } from "@/composables/troveManager";
import { useAccounts } from "@/store/accounts";
import { Decimal } from "@liquity/lib-base";
import { ref } from "vue";

export default {
    setup() {
        const dialogOpen = ref(false);
        const amount = ref(0);

        const accounts = useAccounts();
        const { onAccount, contracts } = useAeppSdk();
        const { activeTrove, loadActiveTrove } = useTroveManager();

        const loadingSupply = ref(false);

        async function supply() {
            loadingSupply.value = true;
            try {
                await contracts.BorrowerOperations.methods.add_coll(
                    accounts.activeAccount,
                    accounts.activeAccount,
                    {
                        amount: Decimal.from(amount.value).bigNumber,
                        onAccount: onAccount(),
                    }
                );
                await loadActiveTrove();
                amount.value = 0;

                dialogOpen.value = false;
            } catch (error) {
                console.info("========================");
                console.error("error ::", error);
                console.info("========================");
            }
            loadingSupply.value = false;
            dialogOpen.value = false;
        }

        function openDialog() {
            dialogOpen.value = true;
        }

        return {
            Decimal,
            dialogOpen,
            amount,
            loadingSupply,
            supply,
            openDialog,

            activeTrove,
        };
    },
};
</script>
