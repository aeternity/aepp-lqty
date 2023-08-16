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

            <template v-slot:[`item.coll_ratio`]="{ item: { selectable } }">
                <span :class="[selectable.coll_ratio.color]">
                    {{ selectable.coll_ratio.text }}
                </span>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import SystemStatsCard from "@/components/Cards/SystemStatsCard.vue";
import { useAeppSdk } from "@/composables";
import { usePriceFeed } from "@/composables/priceFeed";
import { formatAddress } from "@/utils";
import {
    CRITICAL_COLLATERAL_RATIO,
    Decimal,
    Percent,
    Trove,
} from "@liquity/lib-base";
import { onMounted, ref } from "vue";

export default {
    components: {
        SystemStatsCard,
    },
    setup() {
        const { contracts } = useAeppSdk();

        const { loadPriceFeed, priceFeed } = usePriceFeed();

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

        function formatDecimal(value: string) {
            return Decimal.fromBigNumberString(value).prettify(2);
        }

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

            const addresses: string[] = [];

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

                const newTrove = new Trove(
                    Decimal.fromBigNumberString(trove.coll),
                    Decimal.fromBigNumberString(trove.debt)
                );

                const collateralRatio = newTrove.collateralRatio(
                    priceFeed.value.toString()
                );

                items.value.push({
                    owner: address,
                    collateral: formatDecimal(trove.coll),
                    debt: formatDecimal(trove.debt),
                    coll_ratio: {
                        color: collateralRatio.gt(CRITICAL_COLLATERAL_RATIO)
                            ? "text-success"
                            : collateralRatio.gt(1.2)
                            ? "text-warning"
                            : "text-danger",
                        text: new Percent(collateralRatio).prettify(),
                    },
                });
            }
            loading.value = false;
        }

        onMounted(async () => {
            await loadPriceFeed();
            fetchOpenTroves();
        });

        return {
            loading,

            formatAddress,
            formatDecimal,

            Decimal,

            headers,
            items,
            itemsPerPage,
        };
    },
};
</script>
