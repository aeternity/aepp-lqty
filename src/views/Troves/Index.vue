<template>
    <div>
        <div v-if="!troves.length" class="text-center pa-12">
            <v-img
                src="@/assets/images/vault.svg"
                width="50%"
                class="mx-auto"
            />

            <h1 class="pt-6">No Open Troves Found!</h1>
        </div>
        <v-row>
            <v-col
                v-for="(trove, index) of troves"
                :key="index"
                cols="12"
                md="4"
            >
                <v-card>
                    <v-card-title>
                        <v-avatar size="30">
                            <v-img
                                :src="`https://avatars.z52da5wt.xyz/${trove.address}`"
                            />
                        </v-avatar>
                        {{ formatAddress(trove.address) }}
                    </v-card-title>
                    <v-divider />
                    <v-card-text class="d-flex justify-space-around">
                        <div>
                            <strong>Collateral:</strong>
                            {{
                                Decimal.fromBigNumberString(
                                    trove.coll
                                ).prettify(2)
                            }}
                            AE
                        </div>
                        <v-divider vertical/>
                        <div>
                            <strong>Debt:</strong>
                            {{
                                Decimal.fromBigNumberString(
                                    trove.debt
                                ).prettify(2)
                            }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <div v-if="loading" class="d-flex align-center justify-center pa-12">
            <div class="text-center">
                <v-progress-circular indeterminate color="primary" size="40" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useAeppSdk } from "@/composables";
import { onMounted, ref } from "vue";
import { formatAddress } from "@/utils";
import { Decimal } from "@liquity/lib-base";

export default {
    setup() {
        const { contracts } = useAeppSdk();
        const loading = ref(false);
        const troves = ref<any[]>([]);

        async function fetchOpenTroves() {
            loading.value = true;
            const openTrovesCount = (
                await contracts.TroveManager.methods.get_trove_owners_count()
            ).decodedResult;
            console.info("========================");
            console.info("fetchOpenTroves openTrovesCount ::", openTrovesCount);
            console.info(
                "fetchOpenTroves openTrovesCount as int::",
                parseInt(openTrovesCount)
            );
            console.info("========================");
            function* range(from: number, to: number, step = 1) {
                let value = from;
                while (value <= to) {
                    yield value;
                    value += step;
                }
            }

            const addresses: string[] = [];

            // loop though openTrovesCount and retieve trove owner
            for (const i of range(0, parseInt(openTrovesCount) - 1)) {
                const address = (
                    await contracts.TroveManager.methods.get_trove_from_trove_owners_array(
                        i
                    )
                ).decodedResult as string;
                const trove = (
                    await contracts.TroveManager.methods.troves(address)
                ).decodedResult;
                console.info("========================");
                console.info("address ::", address);
                console.info("trove ::", trove);
                console.info("========================");
                troves.value.push({
                    address,
                    ...trove,
                });
            }

            console.info("========================");
            console.info("openTroves ::", addresses);
            console.info("========================");
            loading.value = false;
        }

        onMounted(() => {
            fetchOpenTroves();
        });

        return {
            loading,
            troves,

            formatAddress,

            Decimal,
        };
    },
};
</script>
