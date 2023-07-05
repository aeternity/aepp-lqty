<template>
    <v-text-field
        v-bind="$attrs"
        :value="isFocused ? modelValue.toString() : modelValue.prettify(2)"
        @input="onValueChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
        outline
    ></v-text-field>
</template>

<script lang="ts">
import { Decimal } from "@liquity/lib-base";
import { PropType, ref } from "vue";

export default {
    props: {
        modelValue: {
            type: Object as PropType<Decimal>,
            required: true,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const isFocused = ref<boolean>(false);

        function onValueChange(event: any) {
            emit("update:modelValue", Decimal.from(event.target.value));
        }

        return {
            isFocused,
            onValueChange,
        };
    },
};
</script>

