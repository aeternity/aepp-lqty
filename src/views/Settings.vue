<template>
    <v-row>
        <v-col cols="12" md="6">
            <v-card class="mt-2">
                <v-card-title> Price Feed Settings </v-card-title>
                <v-card-text>
                    <AmountInput
                        label="AE"
                        placeholder="PriceFeed"
                        v-model="localPriceFeed"
                    />
                    <v-btn
                        color="primary"
                        :loading="priceFeedLoading"
                        @click="onUpdatePriceFeed()"
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
import { usePriceFeed } from "@/store/priceFeed";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export default {
    components: { AmountInput },
    setup() {
        const { priceFeed } = storeToRefs(usePriceFeed());

        const priceFeedLoading = ref(false);
        const localPriceFeed = ref(priceFeed.value);

        const { updatePriceFeed } = usePriceFeed();

        async function onUpdatePriceFeed() {
            priceFeedLoading.value = true;
            await updatePriceFeed(localPriceFeed.value);
            priceFeedLoading.value = false;
        }

        return {
            localPriceFeed,
            onUpdatePriceFeed,
            priceFeedLoading,
        };
    },
};
</script>
