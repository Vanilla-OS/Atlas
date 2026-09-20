<template>
  <div class="topbar bg-white dark:bg-gray-900 shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex flex-wrap items-center justify-between gap-3 py-4" aria-label="main navigation">
        <router-link to="/" class="flex items-center">
          <img src="/atlas-logo.svg" alt="Logo" class="w-16 dark:filter dark:invert">
        </router-link>
        <div class="order-last w-full flex items-center gap-1.5 overflow-x-auto sm:order-none sm:w-auto sm:flex-1 sm:justify-center"
          role="tablist" aria-label="image categories">
          <button v-for="category in categories" :key="category.id" role="tab" :title="category.subtitle"
            :aria-selected="atlasStore.activeCategory === category.id" @click="setCategory(category.id)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap cursor-pointer transition-colors duration-200"
            :class="atlasStore.activeCategory === category.id
              ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
              : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'">
            <i class="material-icons text-base leading-none">{{ category.icon }}</i>
            {{ category.label }}
          </button>
        </div>
        <div class="navbar-end">
          <div class="buttons flex space-x-2">
            <button @click="setLayout" v-if="route.name == 'home'"
              :title="atlasStore.layout == 'list' ? 'Switch to grid view' : 'Switch to list view'"
              class="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <i class="material-icons">{{ atlasStore.layout == 'list' ? 'view_list' : 'view_module' }}</i>
            </button>
            <button @click="updateCache" title="Refresh" v-if="route.name == 'home'"
              class="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <i class="material-icons">refresh</i>
            </button>
            <a href="https://vib.vanillaos.org/" target="_blank"
              class="flex items-center p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <i class="material-icons">help</i>
            </a>
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
    categories() {
      return AtlasConfig.categories;
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
    setCategory(id: string) {
      this.atlasStore.$patch((state) => {
        state.activeCategory = id;
      });
      if (this.$route.name !== "home") {
        this.$router.push({ name: "home" });
      }
    },
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
