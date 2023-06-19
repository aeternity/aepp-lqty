<template>
    <v-row>
        <v-col cols="6">
            <v-card>
                <v-card-text class="d-flex align-center">
                    <div class="d-flex align-center">
                        <img
                            src="../../../assets/tokens/ae.svg"
                            class="token-icon"
                        />
                        <div class="text-h6 pl-4">
                            {{
                                Decimal.fromBigNumberString(
                                    activeTrove.coll
                                ).prettify(2)
                            }}
                        </div>
                    </div>
                    <v-spacer />
                    <v-chip small color="green">Collateral</v-chip>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <collateral-supply />
                    <v-spacer />
                    <collateral-withdraw />
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card>
                <v-card-text class="d-flex">
                    <div class="d-flex align-center">
                        <v-avatar start>
                            <v-img
                                :src="`https://avatars.z52da5wt.xyz/${AEUSD_TOKEN.contractAddress}`"
                                class="token-icon"
                            />
                        </v-avatar>
                        <div class="text-h6 pl-4">
                            {{
                                Decimal.fromBigNumberString(
                                    activeTrove.debt
                                ).prettify(2)
                            }}
                            {{ AEUSD_TOKEN.symbol }}
                        </div>
                    </div>
                    <v-spacer />
                    <v-chip small color="orange">Dept</v-chip>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                    <borrow-stable-coin />
                    <v-spacer />
                    <pay-back-stable-coin />
                </v-card-actions>
            </v-card>
        </v-col>

        <v-col cols="6">
            <close-trove />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { useTroveManager } from "@/composables/troveManager";
import { aettosToAe, numberFormat, AEUSD_TOKEN } from "@/utils";
import CollateralSupply from "./CollateralSupply.vue";
import CollateralWithdraw from "./CollateralWithdraw.vue";
import PayBackStableCoin from "./PayBackStableCoin.vue";
import BorrowStableCoin from "./BorrowStableCoin.vue";
import CloseTrove from "./CloseTrove.vue";
import { Decimal } from "@liquity/lib-base";

export default {
    name: "TrovePosition",
    components: {
        CollateralSupply,
        CollateralWithdraw,
        PayBackStableCoin,
        BorrowStableCoin,
        CloseTrove,
    },
    setup() {
        const { loadActiveTrove, activeTrove } = useTroveManager();
        return {
            AEUSD_TOKEN,
            Decimal,

            activeTrove,
            aettosToAe,
            numberFormat,
        };
    },
};
</script>

<style scoped>
.token-icon {
    width: 40px;
}
</style>
