<template>
    <div v-if="accounts.activeAccount" class="d-flex align-center px-4">
        <v-chip @click="accountDetailDialog = true">
            <v-avatar start>
                <v-img
                    :src="`https://avatars.z52da5wt.xyz/${accounts.activeAccount}`"
                />
            </v-avatar>

            {{ formatAddress(accounts.activeAccount) }}
        </v-chip>

        <div class="pl-4" v-if="!balances.balance?.isZero">
            {{ balances.balance.prettify(2) }} AE
        </div>

        <v-dialog v-model="accountDetailDialog" max-width="600px">
            <v-card>
                <v-card-title>
                    {{ formatAddress(accounts.activeAccount) }}
                </v-card-title>
                <v-card-text>
                    <div>
                        <strong>Wallet:</strong> {{ wallet.walletInfo?.name }}
                    </div>

                    <div>
                        <strong>Network ID:</strong>
                        {{ wallet.walletInfo?.networkId }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" @click="wallet.disconnectWallet()">
                        Disconnect
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { useAccounts } from "@/store/accounts";
import { useBalances } from "@/store/balances";
import { useWalletConnect } from "@/store/walletConnect";
import { formatAddress } from "@/utils";
import { ref } from "vue";

export default {
    name: "HeaderAccountCard",
    setup() {
        const accounts = useAccounts();
        const balances = useBalances();
        const wallet = useWalletConnect();

        const accountDetailDialog = ref(false);

        return {
            balances,
            wallet,
            accounts,

            accountDetailDialog,

            formatAddress,
        };
    },
};
</script>
