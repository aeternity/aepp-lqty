<template>
    <v-row>
        <v-col cols="6">
            <v-card>
                <v-card-text class="d-flex align-center">
                    <div class="d-flex align-center">
                        <img
                            src="../../assets/tokens/ae.svg"
                            class="token-icon"
                        />
                        <div class="text-h6 pl-4">
                            {{ aettosToAe(activeTrove.coll) }}
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
                        <img
                            src="../../assets/tokens/lusd.svg"
                            class="token-icon"
                        />
                        <div class="text-h6 pl-4">
                            {{ numberFormat(activeTrove.debt) }}
                            AEUSD
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

<script lang="ts" setup>
import { useTroveManager } from "@/composables/troveManager";
import { aettosToAe, numberFormat } from "@/utils/numbers";
import CollateralSupply from "./CollateralSupply.vue";
import CollateralWithdraw from "./CollateralWithdraw.vue";
import PayBackStableCoin from "./PayBackStableCoin.vue";
import BorrowStableCoin from "./BorrowStableCoin.vue";
import CloseTrove from "./CloseTrove.vue";

const { loadActiveTrove, activeTrove } = useTroveManager();
</script>

<style scoped>
.token-icon {
    width: 40px;
}
</style>
