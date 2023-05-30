<template>
  <v-app>
    <default-bar />
    <left-side-bar/>

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import LeftSideBar from './LeftSideBar.vue'
  import RightSideBar from './RightSideBar.vue'
  import DefaultView from './View.vue'
</script>
