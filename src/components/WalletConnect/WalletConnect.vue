 <template>
    <div>
        <v-btn
            v-if="!connectedWalletInfo"
            color="primary"
            @click="scanForWallets()"
            :loading="scanningForWallets"
        >
            <v-img src="../../assets/superhero.png" width="40"/>
            Connect Wallet
        </v-btn>
    </div>
</template>

<script lang="ts">
import { useWalletConnect } from "@/composables";

export default {
    setup(props) {
        const { scanForWallets, scanningForWallets, connectedWalletInfo } =
            useWalletConnect();

        return {
            connectedWalletInfo,
            scanForWallets,
            scanningForWallets,
        };
    },
};
</script>
