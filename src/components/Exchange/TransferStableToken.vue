<template>
    <div>
        <v-btn color="green" @click="dialogOpen = true"> Transfer </v-btn>

        <v-dialog v-model="dialogOpen" max-width="500px">
            <v-card>
                <v-card-title> Transfer {{ AEUSD_TOKEN.symbol }} </v-card-title>
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
                            :suffix="AEUSD_TOKEN.symbol"
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

<script lang="ts">
import { ref } from "vue";

import { useAeppSdk } from "@/composables";
import { useStableToken } from "@/composables/stableToken";
import { useTokens } from "@/store/tokens";
import { Decimal } from "@liquity/lib-base";
import { storeToRefs } from "pinia";

export default {
    setup() {
      const { AEUSD_TOKEN } = storeToRefs(useTokens());

        const { onAccount, contracts } = useAeppSdk();
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
                    Decimal.from(amount.value ?? 0).bigNumber,
                    {
                        onAccount: onAccount(),
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

        return {
            dialogOpen,
            amount,
            recipient,
            loadingTransfer,
            transfer,

            AEUSD_TOKEN,
        };
    },
};
</script>
