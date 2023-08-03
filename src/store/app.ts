// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const darkMode = ref(true);
    const leftSideBar = ref(false);

    function toggleDarkMode() {
      darkMode.value = !darkMode.value;
    }

    return {
      darkMode,
      leftSideBar,
      toggleDarkMode,
    };
  },
  { persist: true }
);
