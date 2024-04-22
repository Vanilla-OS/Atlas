<template>
  <div class="topbar bg-white dark:bg-gray-900 shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex justify-between items-center py-4" aria-label="main navigation">
        <router-link to="/" class="flex items-center">
          <img src="/atlas-logo.svg" alt="Logo" class="w-16">
        </router-link>
        <div class="navbar-end">
          <div class="buttons flex space-x-2">
            <button @click="setLayout"
              :title="atlasStore.layout == 'list' ? 'Switch to grid view' : 'Switch to list view'"
              class="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <i class="material-icons">{{ atlasStore.layout == 'list' ? 'view_list' : 'view_module' }}</i>
            </button>
            <button @click="updateCache" title="Refresh"
              class="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <i class="material-icons">refresh</i>
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>

  <router-view />

  <br />
  <br />

  <footer class="bg-white dark:bg-gray-900 mt-12">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
      <p class="text-base text-gray-600 dark:text-gray-400">
        <strong>Atlas</strong> by <a href="https://vanillaos.org"
          class="text-blue-600 dark:text-blue-400 hover:underline">Vanilla OS</a>.
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AtlasConfig from "./config";
import { useAtlasStore } from "@/core/store";

export default defineComponent({
  data() {
    return {
      title: "",
    };
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  setup() {
    const atlasStore = useAtlasStore();
    return { atlasStore };
  },
  mounted() {
    this.title = AtlasConfig.title;
  },
  methods: {
    setLayout() {
      this.atlasStore.$patch((state) => {
        state.layout = state.layout == "list" ? "grid" : "list";
      });
      console.log(this.atlasStore.layout);
    },
    updateCache() {
      this.atlasStore.$patch((state) => {
        state.lastFetchDate = new Date().getTime();
        state.vibRecipes = [];
      });
      // @ts-ignore
      this.$atlasManager.getVibRecipes(true);
    },
  },
});
</script>
