<template>
    <div>
        <SystemStatsCard />
        <v-alert
            class="my-4"
            icon="mdi-information"
            border="start"
            variant="tonal"
            outline
            color="info"
            title="Automation is anticipated to oversee the process of liquidation through the use of advanced bots."
            text="In the initial stages, you might have the option to manually liquidate Troves; however, as the system evolves, this capability is likely to diminish."
        ></v-alert>
        <v-card class="my-4">
            <v-card-title> Liquidate </v-card-title>
            <v-card-text>
                <v-row align="center">
                    <v-col cols="12" md="8" class="pb-0">
                        <v-text-field
                            label="Number of Troves to Liquidate"
                            variant="outlined"
                            v-model="numberOfTrovesToLiquidate"
                            type="number"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-btn
                            color="red"
                            block
                            size="large"
                            :loading="liquidatingTroves"
                            @click="onMassLiquidateTroves()"
                        >
                            Liquidate
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-card>
            <v-card-title class="d-flex align-center">
                <h3 class="text-h5">Open Troves</h3>
                <v-spacer></v-spacer>
                <v-btn flat icon @click="fetchOpenTroves()">
                    <v-icon>mdi-reload</v-icon>
                </v-btn>
            </v-card-title>
            <v-data-table
                flat
                :loading="loading"
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="items"
            >
                <template v-slot:[`item.owner`]="{ item: { selectable } }">
                    <v-chip pill link>
                        <v-avatar size="30" class="mr-2" start>
                            <v-img
                                :src="`https://avatars.z52da5wt.xyz/${selectable.owner}`"
                            />
                        </v-avatar>
                        {{ formatAddress(selectable.owner) }}
                    </v-chip>
                </template>

                <template v-slot:[`item.collateral`]="{ item: { selectable } }">
                    {{ selectable.trove.collateral.prettify(2) }}
                </template>

                <template v-slot:[`item.debt`]="{ item: { selectable } }">
                    {{ selectable.trove.debt.prettify(2) }}
                </template>

                <template v-slot:[`item.coll_ratio`]="{ item: { selectable } }">
                    <CollateralRatioValue :trove="selectable.trove" />
                </template>

                <template v-slot:[`item.action`]="{ item: { selectable } }">
                    <v-btn
                        color="red"
                        :loading="loading"
                        @click="onLiquidateTrove(selectable.owner)"
                    >
                        Liquidate
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script lang="ts">
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";
import CollateralRatioValue from "@/components/Liquity/Shared/CollateralRatioValue.vue";
import { useAeppSdk } from "@/composables";
import { formatAddress } from "@/utils";
import { Decimal, Percent, Trove } from "@liquity/lib-base";
import { onMounted, ref } from "vue";
import { useLiquityStore } from "@/store/liquityStore";

export default {
    components: {
        SystemStatsCard,
        CollateralRatioValue,
    },
    setup() {
        const { contracts } = useAeppSdk();
        const { preloadInitialData } = useLiquityStore();

        const numberOfTrovesToLiquidate = ref(10);
        const liquidatingTroves = ref(false);

        const loading = ref(false);
        const headers = [
            {
                title: "Owner",
                align: "start",
                sortable: false,
                key: "owner",
            },
            { title: "Collateral", align: "end", key: "collateral" },
            { title: "Debt", align: "end", key: "debt" },
            { title: "Coll. Ratio", align: "end", key: "coll_ratio" },
            { title: "", align: "end", key: "action" },
        ];
        const itemsPerPage = ref(5);
        const items = ref<any[]>([]);

        async function onMassLiquidateTroves() {
            liquidatingTroves.value = true;

            try {
                await contracts.TroveManager.methods.liquidate_troves(
                    numberOfTrovesToLiquidate.value
                );
                fetchOpenTroves();
                preloadInitialData();
            } catch (error) {
                console.info("onMassLiquidateTroves->error ::", error);
            }
            liquidatingTroves.value = false;
        }

        async function onLiquidateTrove(address: string) {
            loading.value = true;
            try {
                await contracts.TroveManager.methods.liquidate(address);
                // remove trove from list
                items.value = items.value.filter(
                    (item) => item.owner !== address
                );
                preloadInitialData();
            } catch (error) {
                console.info("onLiquidateTrove->error ::", error);
            }
            loading.value = false;
        }

        async function fetchOpenTroves() {
            items.value = [];
            loading.value = true;
            const openTrovesCount = (
                await contracts.TroveManager.methods.get_trove_owners_count()
            ).decodedResult;

            function* range(from: number, to: number, step = 1) {
                let value = from;
                while (value <= to) {
                    yield value;
                    value += step;
                }
            }

            // loop though openTrovesCount and retrieve trove owner
            for (const i of range(0, parseInt(openTrovesCount) - 1)) {
                const address = (
                    await contracts.TroveManager.methods.get_trove_from_trove_owners_array(
                        i
                    )
                ).decodedResult as string;

                const trove = (
                    await contracts.TroveManager.methods.troves(address)
                ).decodedResult;

                items.value.push({
                    owner: address,
                    trove: new Trove(
                        Decimal.fromBigNumberString(trove.coll),
                        Decimal.fromBigNumberString(trove.debt)
                    ),
                });
            }
            loading.value = false;
        }

        onMounted(async () => {
            fetchOpenTroves();
        });

        return {
            loading,
            onLiquidateTrove,
            fetchOpenTroves,

            formatAddress,

            Decimal,
            Percent,

            headers,
            items,
            itemsPerPage,

            numberOfTrovesToLiquidate,
            liquidatingTroves,
            onMassLiquidateTroves,
        };
    },
};
</script>
