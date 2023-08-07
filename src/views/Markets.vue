<template>
    <v-row>
        <v-col cols="12">
            <h2>Aeternity Markets</h2>
        </v-col>
        <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="items"
                item-value="name"
                class="elevation-1"
            >
                <template v-slot:item.total_supplied="{ item }">
                    {{ item.selectable.symbol }}
                    {{ item.selectable.total_supplied.prettify(2) }}
                </template>
            </v-data-table>
        </v-col>
        <v-col cols="12">
            {{ items }}
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { Decimal } from "@liquity/lib-base";
import { onMounted, ref } from "vue";

export default {
    components: {},
    setup() {
        const { contracts, onAccount } = useAeppSdk();

        const token = ref({
            symbol: "AEUSD",
            total_supplied: Decimal.ZERO,
        });

        const headers = [
            {
                title: "Asset",
                align: "start",
                key: "symbol",
            },
            {
                title: "Total supplied",
                // align: "start",
                key: "total_supplied",
            },
            // {
            //     title: "Supply APY",
            //     align: "start",
            //     sortable: true,
            //     key: "supply_apy",
            // },
            // {
            //     title: "Total borrowed",
            //     align: "start",
            //     sortable: true,
            //     key: "total_borrowed",
            // },
            // {
            //     title: "Borrow APY",
            //     align: "start",
            //     sortable: true,
            //     key: "borrow_apy",
            // },
            // {
            //     title: "",
            //     align: "start",
            //     sortable: true,
            //     key: "actions",
            // },
        ];

        const items = ref([]);

        async function analyseStabilityPool() {
            const [
                get_ae,
                get_entire_system_coll,
                get_entire_system_debt,
                get_compounded_front_end_stake,
            ] = await Promise.all([
                contracts.StabilityPool.methods.get_ae(),
                contracts.StabilityPool.methods.get_entire_system_coll(),
                contracts.StabilityPool.methods.get_entire_system_debt(),
                // contracts.StabilityPool.methods.get_compounded_front_end_stake(
                //     5
                // ),
            ]);

            console.info("========================");
            console.info("get_ae ::", get_ae);
            console.info("get_entire_system_coll ::", get_entire_system_coll);
            console.info("get_entire_system_debt ::", get_entire_system_debt);
            console.info(
                "get_compounded_front_end_stake ::",
                get_compounded_front_end_stake
            );
            console.info("========================");
        }

        async function analyseBorrowerOperation() {
            const [
                get_entire_system_coll,
                get_entire_system_debt,
                get_aeusd_debt,
                get_ae,
                coll_get_ae,
                default_pool_get_ae,
                default_pool_get_aeusd_debt,
                get_compounded_front_end_stake,
            ] = await Promise.all([
                contracts.BorrowerOperations.methods.get_entire_system_coll(),
                contracts.BorrowerOperations.methods.get_entire_system_debt(),
                contracts.ActivePool.methods.get_aeusd_debt(),
                contracts.ActivePool.methods.get_ae(),
                contracts.CollSurplusPool.methods.get_ae(),
                contracts.DefaultPool.methods.get_ae(),
                contracts.DefaultPool.methods.get_aeusd_debt(),
                contracts.StabilityPool.methods.get_compounded_front_end_stake(
                    5
                ),
            ]);

            console.info("========================");
            console.info("get_entire_system_coll ::", get_entire_system_coll);
            console.info("get_entire_system_debt ::", get_entire_system_debt);
            console.info("get_aeusd_debt ::", get_aeusd_debt);
            console.info("get_ae ::", get_ae);
            console.info("CollSurplusPool->get_ae ::", coll_get_ae);
            console.info("DefaultPool->get_ae ::", default_pool_get_ae);
            console.info(
                "DefaultPool->get_aeusd_debt ::",
                default_pool_get_aeusd_debt
            );
            console.info("========================");
        }

        async function loadAEUSDInfo() {
            const total_supplied = Decimal.fromBigNumberString(
                (await contracts.AEUSDToken.methods.total_supply())
                    .decodedResult
            );
            items.value.push({
                symbol: "AEUSD",
                total_supplied,
            });

            const meta_info = (await contracts.AEUSDToken.methods.meta_info())
                .decodedResult;

            console.info("========================");
            console.info("meta_info ::", meta_info);
            console.info("========================");
        }

        async function loadLQTYInfo() {
            const total_supplied = Decimal.fromBigNumberString(
                (await contracts.LQTYToken.methods.total_supply()).decodedResult
            );
            items.value.push({
                symbol: "LQTY",
                total_supplied,
            });
        }

        onMounted(() => {
            analyseStabilityPool();
            loadAEUSDInfo();
            loadLQTYInfo();
        });
        return {
            items,
            headers,
        };
    },
};
</script>
