 <template>
    <v-btn
        v-if="!walletConnect.walletInfo"
        color="primary"
        @click="onScanForWallets()"
        :loading="walletConnect.scanningForWallets"
    >
        <v-img src="../../assets/superhero.png" width="40" />
        Connect Wallet
    </v-btn>
</template>

<script lang="ts">
import { useWalletConnect } from "@/store/walletConnect";
import { onMounted } from "vue";

export default {
    setup() {
        const walletConnect = useWalletConnect();

        async function onScanForWallets() {
            walletConnect.connectWallet();
        }

        onMounted(() => {
            if (walletConnect.walletInfo) {
                walletConnect.connectWallet();
            }
        });

        return {
            walletConnect,
            onScanForWallets,
        };
    },
};
</script>
