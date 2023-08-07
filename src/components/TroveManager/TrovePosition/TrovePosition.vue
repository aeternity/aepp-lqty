<template>
    <v-row>
        <v-col cols="12" md="6">
            <v-card>
                <v-card-text class="d-flex align-center">
                    <div class="d-flex align-center">
                        <img
                            src="@/assets/tokens/ae.svg"
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
                    <CollateralSupply />
                    <v-spacer />
                    <CollateralWithdraw />
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="12" md="6">
            <v-card>
                <v-card-text class="d-flex">
                    <div class="d-flex align-center">
                        <v-avatar start>
                            <v-img
                                :src="`https://avatars.z52da5wt.xyz/${AEUSD_TOKEN.contractId}`"
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
                    <BorrowStableCoin />
                    <v-spacer />
                    <PayBackStableCoin />
                </v-card-actions>
            </v-card>
        </v-col>

        <v-col cols="12" md="6">
            <CloseTrove />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { useTroveManager } from "@/composables/troveManager";
import { AEUSD_TOKEN } from "@/utils";
import { Decimal } from "@liquity/lib-base";
import BorrowStableCoin from "./BorrowStableCoin.vue";
import CloseTrove from "./CloseTrove.vue";
import CollateralSupply from "./CollateralSupply.vue";
import CollateralWithdraw from "./CollateralWithdraw.vue";
import PayBackStableCoin from "./PayBackStableCoin.vue";

export default {
    components: {
        CollateralSupply,
        CollateralWithdraw,
        PayBackStableCoin,
        BorrowStableCoin,
        CloseTrove,
    },
    setup() {
        const { activeTrove } = useTroveManager();
        return {
            AEUSD_TOKEN,
            Decimal,

            activeTrove,
        };
    },
};
</script>

<style scoped>
.token-icon {
    width: 40px;
}
</style>
