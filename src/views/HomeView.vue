<template>
  <div v-if="atlasStore.vibRecipes" class="dark:bg-gray-900 min-h-screen">
    <section class="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 py-8 transition-colors duration-300">
      <div class="container relative mx-auto px-4 py-8 overflow-hidden rounded-xl">
        <div
          class="hero-backdrop absolute inset-0 z-0 rounded-xl"
          :style="{
            '--hero-bg-light': `url(${backgrounds.light})`,
            '--hero-bg-dark': `url(${backgrounds.dark})`,
          }"
        ></div>

        <div class="relative z-10">
          <h1 class="text-3xl font-bold text-center">{{ activeCategory.title }}</h1>
          <p v-if="activeCategory.subtitle" class="mt-2 text-center opacity-80">{{ activeCategory.subtitle }}</p>
          <p class="mt-2 text-center opacity-70 text-sm">
            Showing {{ filteredRecipes.length }} of {{ categoryRecipes.length }} recipes
          </p>

          <div class="max-w-3xl mx-auto mt-6 space-y-4">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <font-awesome-icon :icon="['fas', 'search']" class="text-gray-400" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or repository..."
                class="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <font-awesome-icon :icon="['fas', 'times-circle']" />
              </button>
            </div>

            <div class="flex items-center justify-center gap-4">
              <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  v-model="hideOutdated"
                  type="checkbox"
                  class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Hide outdated recipes</span>
              </label>
            </div>

            <div v-if="availableTags.length > 0" class="flex flex-wrap gap-2 justify-center">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400 self-center mr-2">Filters:</span>

              <button
                v-for="tag in availableTags"
                :key="tag.value"
                @click="toggleTag(tag.value)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
                :class="activeTags.includes(tag.value)
                  ? getActiveTagClasses(tag.type)
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700'"
              >
                <font-awesome-icon
                  :icon="tag.type === 'de' ? ['fas', 'desktop'] : ['fas', 'microchip']"
                  class="text-[10px]"
                />
                {{ tag.label }}
              </button>

              <button
                v-if="activeTags.length > 0"
                @click="activeTags = []"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline ml-2 self-center"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
      <div v-if="filteredRecipes.length === 0" class="text-center py-20">
        <font-awesome-icon :icon="['fas', 'filter-circle-xmark']" class="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
        <h3 class="text-xl font-medium text-gray-900 dark:text-gray-100">No recipes found</h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
        <button
          @click="resetFilters"
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Reset all filters
        </button>
      </div>

      <div v-else-if="atlasStore.layout === 'list'" class="overflow-x-auto">
        <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead class="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Recipe Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Repository
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Stages
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Modules
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Runs
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-950">
            <tr v-for="(recipe, index) in filteredRecipes" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                <div class="flex items-center gap-2">
                  {{ recipe.name }}
                  <RecipeStatusBadge :recipe="recipe" size="sm" />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {{ recipe.repo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {{ recipe.stages.length }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {{ getModulesCount(recipe.stages) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {{ getRunsCount(recipe.stages) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                <router-link :to="{ name: 'recipe', params: { id: recipe.id } }"
                  class="text-indigo-600 dark:text-indigo-200 hover:text-indigo-900 dark:hover:text-indigo-400">View</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(recipe, index) in filteredRecipes" :key="index"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between leading-normal">
          <router-link :to="{ name: 'recipe', params: { id: recipe.id } }" class="no-underline text-black">
            <div class="mb-4">
              <div class="text-black dark:text-white font-bold text-xl mb-2 flex items-center gap-2">
                {{ recipe.name }}
                <RecipeStatusBadge :recipe="recipe" size="sm" />
              </div>

              <code class="text-gray-800 dark:text-gray-400 text-xs font-medium-full md:w-auto block">{{ recipe.repo }}</code>

              <div v-if="recipe.de || recipe.hardware" class="flex flex-wrap gap-3 mt-3 text-sm">
                <span v-if="recipe.de"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <font-awesome-icon :icon="['fas', 'desktop']" class="text-xs" />
                  <span class="font-medium">DE:</span> {{ recipe.de }}
                </span>

                <span v-if="recipe.hardware"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  <font-awesome-icon :icon="['fas', 'microchip']" class="text-xs" />
                  <span class="font-medium">Hardware:</span> {{ recipe.hardware }}
                </span>
              </div>

              <div v-if="atlasStore.activeCategory === 'vib-recipes'" class="flex items-center flex-wrap gap-2 mt-3">
                <span
                  class="inline-flex items-center bg-purple-100 dark:bg-purple-800 dark:text-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded gap-2">
                  <span class="material-icons align-middle text-base">layers</span>
                  {{ recipe.stages.length }}
                </span>
                <span
                  class="inline-flex items-center bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-medium px-2.5 py-0.5 rounded gap-2">
                  <span class="material-icons align-middle text-base">extension</span>
                  {{ getModulesCount(recipe.stages) }}
                </span>
                <span
                  class="inline-flex items-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded gap-2">
                  <span class="material-icons align-middle text-base">terminal</span>
                  {{ getRunsCount(recipe.stages) }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <transition name="fade">
      <div
        class="fixed bottom-0 right-0 m-8 max-w-sm w-full bg-blue-500 text-white py-4 px-6 rounded-lg shadow-lg text-center">
        <p class="text-xl">Loading...</p>
        <p>Please wait while we fetch the recipes.</p>
      </div>
    </transition>
  </div>

  <transition name="fade">
    <div v-if="cacheIsOld && !messageHidden"
      class="fixed bottom-16 right-0 m-8 max-w-sm w-full bg-yellow-300 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-50 p-4 rounded-lg shadow-lg">
      <div class="flex justify-between items-center">
        <p class="font-bold">Warning</p>
        <button class="bg-transparent text-2xl" aria-label="close" @click="hideWarning">&#10005;</button>
      </div>
      <p>Your local data is older than <u>12 hours</u>, which means that you may not see the latest recipes. Do you want
        to update it now?</p>
      <button class="mt-2 py-2 px-4 bg-yellow-500 dark:bg-yellow-700 dark:text-yellow-50 rounded hover:bg-yellow-600" @click="updateCache">Update
        cache</button>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAtlasStore } from "@/core/store";
import AtlasConfig from "@/config";
import RecipeStatusBadge from "@/components/RecipeStatusBadge.vue";

export default defineComponent({
  name: "HomeView",
  components: { RecipeStatusBadge },
  data() {
    return {
      cacheIsOld: false,
      refreshCacheTimer: 0,
      messageHidden: false,
      searchQuery: "",
      activeTags: [] as string[],
      hideOutdated: true,
      backgrounds: {
        light: "https://raw.githubusercontent.com/Vanilla-OS/vanilla-backgrounds/main/backgrounds/fairy-tale-light.webp",
        dark: "https://raw.githubusercontent.com/Vanilla-OS/vanilla-backgrounds/main/backgrounds/fairy-tale-dark.webp",
      },
    };
  },
  setup() {
    const atlasStore = useAtlasStore();
    const categories = AtlasConfig.categories;
    return { atlasStore, categories };
  },
  computed: {
    activeCategory() {
      return (
        this.categories.find((category: any) => category.id === this.atlasStore.activeCategory) ||
        this.categories[0]
      );
    },
    categoryRecipes() {
      const recipes = this.atlasStore.vibRecipes || [];
      return recipes.filter((recipe: any) => recipe.category === this.atlasStore.activeCategory);
    },
    availableTags(): Array<{ label: string; value: string; type: 'de' | 'hardware' }> {
      if (!this.atlasStore.vibRecipes) return [];

      const tags = new Map<string, { label: string; value: string; type: 'de' | 'hardware' }>();

      this.categoryRecipes.forEach((recipe: any) => {
        if (recipe.de) {
          const key = `de:${recipe.de}`;
          if (!tags.has(key)) tags.set(key, { label: recipe.de, value: recipe.de, type: 'de' });
        }
        if (recipe.hardware) {
          const key = `hw:${recipe.hardware}`;
          if (!tags.has(key)) tags.set(key, { label: recipe.hardware, value: recipe.hardware, type: 'hardware' });
        }
      });

      return Array.from(tags.values()).sort((a, b) => {
        if (a.type !== b.type) return a.type === 'de' ? -1 : 1;
        return a.label.localeCompare(b.label);
      });
    },
    filteredRecipes() {
      if (!this.atlasStore.vibRecipes) return [];

      const query = this.searchQuery.toLowerCase().trim();
      const hasTags = this.activeTags.length > 0;

      return this.categoryRecipes.filter((recipe: any) => {
        if (this.hideOutdated && recipe.outdated) return false;

        const matchesSearch = !query ||
          recipe.name?.toLowerCase().includes(query) ||
          recipe.repo?.toLowerCase().includes(query);

        const matchesTags = !hasTags ||
          this.activeTags.includes(recipe.de) ||
          this.activeTags.includes(recipe.hardware);

        return matchesSearch && matchesTags;
      });
    }
  },
  async beforeMount() {
    this.fetchRecipes();
    this.setCacheRefreshTimer();
  },
  methods: {
    toggleTag(value: string) {
      const idx = this.activeTags.indexOf(value);
      if (idx >= 0) {
        this.activeTags.splice(idx, 1);
      } else {
        this.activeTags.push(value);
      }
    },
    resetFilters() {
      this.searchQuery = "";
      this.activeTags = [];
      this.hideOutdated = true;
    },
    getActiveTagClasses(type: string): string {
      if (type === 'de') {
        return 'bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-500';
      }
      return 'bg-purple-600 text-white border-purple-600 dark:bg-purple-600 dark:border-purple-500';
    },
    async fetchRecipes() {
      try {
        // @ts-ignore
        this.$atlasManager.getVibRecipes(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
    checkCacheOld() {
      console.log("Checking cache status..");
      const lastFetchTimestamp = this.atlasStore.lastFetchDate;
      if (lastFetchTimestamp) {
        const lastFetchDate = new Date(lastFetchTimestamp);
        const now = new Date();
        const diff = now.getTime() - lastFetchDate.getTime();
        this.cacheIsOld = diff > 1000 * 60 * 60 * 12;
      }
    },
    async updateCache() {
      try {
        this.cacheIsOld = false;
        this.atlasStore.$patch((state) => {
          state.lastFetchDate = new Date().getTime();
          state.vibRecipes = [];
        });
        // @ts-ignore
        this.$atlasManager.getVibRecipes(true);
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
    setCacheRefreshTimer() {
      if (this.refreshCacheTimer !== 0) return;

      this.refreshCacheTimer = window.setInterval(() => {
        this.checkCacheOld();
      }, 1000 * 60);
    },
    beforeUnmount() {
      if (this.refreshCacheTimer !== 0) {
        window.clearInterval(this.refreshCacheTimer);
        this.refreshCacheTimer = 0;
      }
    },
    hideWarning() {
      this.messageHidden = true;
    },
    getModulesCount(stages: any[]): number {
      if (!stages) return 0;
      return stages.reduce((acc: number, stage: any) => acc + (stage.modules?.length || 0), 0);
    },
    getRunsCount(stages: any[]): number {
      if (!stages) return 0;
      return stages.reduce((acc: number, stage: any) => acc + (stage.runs?.length || 0), 0);
    },
  },
});
</script>

<style>
.hero-backdrop {
  background-image: var(--hero-bg-light);
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  transform: scale(1.05);
  transition: background-image 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .hero-backdrop {
    background-image: var(--hero-bg-dark);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>