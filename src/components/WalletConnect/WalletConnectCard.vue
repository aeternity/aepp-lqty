 <template>
    <v-card v-if="!walletInfo" class="mb-4">
        <div class="d-flex flex-no-wrap justify-space-between">
            <div>
                <v-card-title class="text-h5">
                    Unlock the Full Power of (AE LQTY) with Superhero Wallet!
                </v-card-title>

                <v-card-text>
                    Connect your Superhero Wallet today to experience the
                    complete range of features and unleash the true potential of
                    our decentralized finance platform. Seamlessly access,
                    trade, and participate in all our exciting opportunities
                    with the utmost security and convenience. Don't miss out on
                    the incredible benefits that await you - connect your wallet
                    now!
                </v-card-text>

                <v-card-actions>
                    <WalletConnect />
                </v-card-actions>
            </div>

            <v-avatar class="ma-3" size="125" rounded="0">
                <v-img src="@/assets/images/crypto-portfolio.svg"></v-img>
            </v-avatar>
        </div>
    </v-card>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import WalletConnect from "./WalletConnect.vue";
import { useWalletConnect } from "@/store/walletConnect";

export default {
    components: {
        WalletConnect,
    },
    setup() {
        const { walletInfo } = storeToRefs(useWalletConnect());

        return {
            walletInfo,
        };
    },
};
</script>
