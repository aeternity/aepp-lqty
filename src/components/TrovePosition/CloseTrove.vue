<template>
    <div>
        <v-dialog v-model="dialogOpen" max-width="500px">
            <v-card>
                <v-card-title> Confirm Trove Close </v-card-title>
                <v-card-text>
                    <v-alert
                        v-if="error"
                        class="mb-4"
                        color="error"
                        title="Oops, Something went wrong!"
                        :text="error"
                    ></v-alert>
                    <div v-else>Are you sure you want to close your trove?</div>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click.prevent="dialogOpen = false" color="primary">
                        Cancel
                    </v-btn>
                    <v-spacer />
                    <v-btn
                        :loading="loadingTroveClose"
                        @click.prevent="closeTrove()"
                        color="red"
                    >
                        Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-btn color="error" block large @click="openDialog()">
            Close Trove
        </v-btn>
    </div>
</template>

<script lang="ts" setup>
import useAeSdk from "@/composables/aeSdk";
import { useLqty } from "@/composables/lqty";
import { useStableToken } from "@/composables/stableToken";
import { useTroveManager } from "@/composables/troveManager";
import { ref } from "vue";
const dialogOpen = ref(false);
const error = ref();

const { aeSdk, activeAccount } = useAeSdk();
const { contracts } = useLqty();
const { loadActiveTrove } = useTroveManager();
const { loadAccountStableTokenBalance } = useStableToken();

const loadingTroveClose = ref(false);

async function closeTrove() {
    loadingTroveClose.value = true;
    try {
        await contracts.BorrowerOperations.methods.close_trove({
            onAccount: aeSdk.accounts[activeAccount.value],
        });
        await loadActiveTrove();

        dialogOpen.value = false;
        loadAccountStableTokenBalance();
    } catch (_error: any) {
        error.value = _error.message;
    }
    loadingTroveClose.value = false;
}

function openDialog() {
    dialogOpen.value = true;
}
</script>
