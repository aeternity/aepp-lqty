<template>
    <div v-if="activeAccount" class="d-flex align-center px-4">
        <v-chip v-if="walletInfo" class="mr-4">
            <v-icon color="blue" class="mr-2" size="14">mdi-wallet</v-icon>
            {{ walletInfo?.name }}
        </v-chip>
        <v-chip v-if="activeNetwork" class="mr-4">
            <v-icon color="green" class="mr-2" size="14">mdi-circle</v-icon>
            {{ activeNetwork.name }}
        </v-chip>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-chip v-bind="props">
                    <v-avatar start loading>
                        <v-progress-circular v-if="scanningForAccounts" indeterminate color="primary"/>
                        <v-img
                            v-else
                            :src="`https://avatars.z52da5wt.xyz/${activeAccount}`"
                        />
                    </v-avatar>

                    {{ formatAddress(activeAccount) }}
                    <v-icon>mdi-chevron-down</v-icon>
                </v-chip>
            </template>
            <v-list>
                <template v-for="address in accounts" :key="address">
                    <v-list-item
                        v-if="activeAccount !== address"
                        :value="address"
                        @click="setActiveAccount(address)"
                    >
                        <template v-slot:prepend>
                            <v-avatar start size="24">
                                <v-img
                                    :src="`https://avatars.z52da5wt.xyz/${address}`"
                                />
                            </v-avatar>
                        </template>
                        <v-list-item-title>
                            {{ formatAddress(address) }}
                        </v-list-item-title>
                    </v-list-item>
                </template>
                <v-list-item @click="disconnectWallet()">
                    <v-list-item-title class="text-red">
                        Disconnect
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <div class="pl-4">
            {{ !balance?.isZero ? balance.prettify(2) : 0 }} AE
        </div>

        <v-dialog v-model="accountDetailDialog" max-width="600px">
            <v-card>
                <v-card-title>
                    {{ formatAddress(activeAccount) }}
                </v-card-title>
                <v-card-text>
                    <div><strong>Wallet:</strong> {{ walletInfo?.name }}</div>

                    <div>
                        <strong>Network ID:</strong>
                        {{ walletInfo?.networkId }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" @click="disconnectWallet()">
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
import { useNetworks } from "@/store/networks";
import { useWalletConnect } from "@/store/walletConnect";
import { formatAddress } from "@/utils";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export default {
    name: "HeaderAccountCard",
    setup() {
        const { activeNetwork } = storeToRefs(useNetworks());
        const { setActiveAccount } = useAccounts();
        const { activeAccount, accounts } = storeToRefs(useAccounts());

        const { balance } = storeToRefs(useBalances());

        const { walletInfo, scanningForAccounts } = storeToRefs(
            useWalletConnect()
        );
        const { disconnectWallet } = useWalletConnect();

        const accountDetailDialog = ref(false);

        return {
            scanningForAccounts,

            balance,
            activeAccount,
            accounts,
            setActiveAccount,
            accountDetailDialog,

            formatAddress,

            walletInfo,
            disconnectWallet,

            activeNetwork,
        };
    },
};
</script>
