<template>
    <div
        :class="[
            'input-container px-4 py-2 my-2 rounded',
            {
                'border-error': !isValid,
            },
        ]"
    >
        <div class="input-label">
            {{ label }}
        </div>
        <div class="d-flex justify-space-between">
            <input
                v-if="isEditing"
                class="input text-body-1"
                type="number"
                step="any"
                autofocus
                :defaultValue="modelValue.toString(4)"
                @input="onValueChange"
                @blur="isEditing = false"
            />
            <div
                v-else
                class="pt-2 text-body-1 w-100"
                @click="isEditing = true"
            >
                {{ modelValue.prettify(2) }}
            </div>

            <v-btn variant="flat"> {{ token.symbol }} </v-btn>
        </div>
        <div class="d-flex justify-space-between">
            <div>{{ formattedFiat }}</div>
            <div v-if="!maxAmount?.isZero">
                <span v-if="maxAmountDescription">
                    {{ maxAmountDescription }}
                </span>
                <span class="px-2">
                    {{ maxAmount.prettify(2) }}
                </span>
                <v-btn
                    @click="onSetMaxAmount()"
                    size="small"
                    variant="text"
                    color="primary"
                >
                    max
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Decimal } from "@liquity/lib-base";
import { PropType, ref } from "vue";
import { useCurrencies } from "@/store/currencies";
import { computed } from "vue";
import { IToken } from "@/types";
import { AETERNITY_TOKEN_BASE_DATA, AE_SYMBOL } from "@/utils/constants";
import { storeToRefs } from 'pinia';
import { usePriceFeed } from '@/store/priceFeed';

export default {
    props: {
        modelValue: {
            type: Object as PropType<Decimal>,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        maxAmount: {
            type: Object as PropType<Decimal>,
            required: false,
            default: () => Decimal.ZERO,
        },
        maxAmountDescription: {
            type: String,
            required: false,
        },
        suffix: { // TODO:: remove
            type: String,
            required: false,
            default: "AE",
        },
        token: {
            type: Object as PropType<IToken>,
            required: false,
            default: () => AETERNITY_TOKEN_BASE_DATA,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const { priceFeed } = storeToRefs(usePriceFeed());

        const { getFormattedFiat } = useCurrencies();
        const isFocused = ref<boolean>(false);
        const isEditing = ref<boolean>(false);

        const formattedFiat = computed(() =>
            getFormattedFiat(
                props.modelValue.div(
                    props.token.symbol == AE_SYMBOL ? 1 : priceFeed.value
                )
            )
        );

        const isValid = computed<boolean>(
            () =>
                props.modelValue.gte(Decimal.ZERO) &&
                props.maxAmount.gte(Decimal.ZERO) &&
                props.modelValue.lte(props.maxAmount)
        );

        function onValueChange(event: any) {
            console.info("========================");
            console.info("event.target.value ::", event.target.value);
            console.info("========================");

            emit("update:modelValue", Decimal.from(event.target.value));
        }

        function onSetMaxAmount() {
            emit("update:modelValue", props.maxAmount);
        }

        return {
            isEditing,
            isFocused,
            onValueChange,
            getFormattedFiat,
            onSetMaxAmount,
            isValid,
            formattedFiat,
        };
    },
};
</script>

<style lang="scss" scoped>
.input-container {
    border: 1px solid;
    border-color: rgb(var(--v-border-color));
    position: relative;

    .input-label {
        position: absolute;
        top: -8px;
        padding-inline: 4px;
        background-color: rgb(var(--v-theme-surface));
        color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    }

    .input {
        width: 100%;
        &:focus,
        &:focus-visible {
            border: none;
            outline-width: 0;
        }
    }
}
</style>
