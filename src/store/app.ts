// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const darkMode = ref(true);

    function toggleDarkMode() {
      darkMode.value = !darkMode.value;
    }

    return {
      darkMode,
      toggleDarkMode,
    };
  },
  { persist: true }
);
