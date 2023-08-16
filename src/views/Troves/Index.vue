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

        <v-data-table
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
        </v-data-table>
    </div>
</template>

<script lang="ts">
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";
import CollateralRatioValue from "@/components/Liquity/Shared/CollateralRatioValue.vue";
import { useAeppSdk } from "@/composables";
import { formatAddress } from "@/utils";
import { Decimal, Percent, Trove } from "@liquity/lib-base";
import { onMounted, ref } from "vue";

export default {
    components: {
        SystemStatsCard,
        CollateralRatioValue,
    },
    setup() {
        const { contracts } = useAeppSdk();

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
        ];
        const itemsPerPage = ref(5);
        const items = ref<any[]>([]);

        async function fetchOpenTroves() {
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

            formatAddress,

            Decimal,
            Percent,

            headers,
            items,
            itemsPerPage,
        };
    },
};
</script>
