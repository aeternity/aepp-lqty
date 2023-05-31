<template>
    <div>
        <v-dialog v-model="dialogOpen" max-width="500px">
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

        <v-btn color="primary" @click="openDialog()"> Supply </v-btn>
    </div>
</template>

<script lang="ts" setup>
import useAeSdk from "@/composables/aeSdk";
import { useLqty } from "@/composables/lqty";
import { useTroveManager } from "@/composables/troveManager";
import { decimalsPrefix } from "@/utils/numbers";
import { ref } from "vue";
const dialogOpen = ref(false);
const amount = ref(0);

const { aeSdk, activeAccount } = useAeSdk();
const { contracts } = useLqty();
const { loadActiveTrove } = useTroveManager();

const loadingSupply = ref(false);

async function supply() {
    loadingSupply.value = true;
    try {
        await contracts.BorrowerOperations.methods.add_coll(
            activeAccount.value,
            activeAccount.value,
            {
                amount: decimalsPrefix(amount.value),
                onAccount: aeSdk.accounts[activeAccount.value],
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
</script>
