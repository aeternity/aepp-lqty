<template>
    <div>
        <H2>Aeternity Testnet</H2>
        <div class="pb-4">
            Explore the decentralized oracle networks powered by Aeternity.
        </div>
        <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="items"
            item-value="name"
            class="elevation-1"
        ></v-data-table>

    </div>
</template>

<script lang="ts">
import { MdwClient, Oracle } from "@/plugins/mdw-api-client";
import { onMounted, ref } from "vue";

export default {
    setup() {
        const itemsPerPage = ref(10);
        const items = ref<Oracle[]>([]);

        const headers = [
            {
                title: "Oracle",
                key: "oracle",
            },
            { title: "Active", key: "active" },
            { title: "Query Fee", key: "query_fee" },
            { title: "Expire Height", key: "expire_height" },
        ];

        async function fetchOracles() {
            const result = await MdwClient.getOraclesRaw({
                limit: itemsPerPage.value,
            });
            items.value = (await result.value()).data || [];
        }

        onMounted(() => {
          fetchOracles();
        });

        return {
            itemsPerPage,
            items,
            headers,
        };
    },
};
</script>
