<template>
    <v-row>
        <v-col cols="12" md="6">
            <v-card class="mt-2">
                <v-card-title> Price Feed Settings </v-card-title>
                <v-card-text>
                    <AmountInput
                        label="AE"
                        placeholder="PriceFeed"
                        v-model="priceFeed"
                    />
                    <v-btn
                        color="primary"
                        :loading="priceFeedLoading"
                        @click="updatePriceFeed(priceFeed)"
                    >
                        Update Price Feed
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import AmountInput from "@/components/Forms/AmountInput.vue";
import { Decimal } from "@liquity/lib-base";
import { onMounted, ref } from "vue";
import { usePriceFeed } from "@/composables/priceFeed";

export default {
    components: { AmountInput },
    setup() {
        const { priceFeed, priceFeedLoading, updatePriceFeed, loadPriceFeed } =
            usePriceFeed();

        onMounted(() => {
            loadPriceFeed();
        });
        return {
            priceFeed,
            priceFeedLoading,

            updatePriceFeed,
        };
    },
};
</script>
