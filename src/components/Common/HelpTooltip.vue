<template>
    <v-tooltip :text="text">
        <template v-slot:activator="{ props }">
            <v-icon v-bind="props" icon="mdi-information"></v-icon>
        </template>
    </v-tooltip>
</template>

<script lang="ts">
export default {
    props: {
        text: {
            type: String,
            required: true,
        },
    },
};
</script>
