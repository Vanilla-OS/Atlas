<template>
  <div v-if="atlasStore.vibRecipes">

    <section class="bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 text-center py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold">Vib Images</h1>
        <p class="mt-4">There are {{ atlasStore.vibRecipes.length }} recipes available.</p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div v-if="atlasStore.layout === 'list'">
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-lg shadow">
            <thead class="bg-gray-200">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Recipe Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Repository
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Stages
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Modules
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Runs
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(recipe, index) in atlasStore.vibRecipes" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ recipe.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ recipe.repo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ recipe.stages.length }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getModulesCount(recipe.stages) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getRunsCount(recipe.stages) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <router-link :to="{ name: 'recipe', params: { id: recipe.id } }"
                    class="text-indigo-600 hover:text-indigo-900">View</router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(recipe, index) in atlasStore.vibRecipes" :key="index"
          class="bg-white rounded-lg shadow p-6 flex flex-col justify-between leading-normal">
          <router-link :to="{ name: 'recipe', params: { id: recipe.id } }" class="no-underline text-black">
            <div>
              <div class="mb-4">
                <div class="text-black font-bold text-xl mb-2">{{ recipe.name }}</div>
                <code class=" text-gray-800 text-xs font-medium-full md:w-auto block">{{ recipe.repo }}</code>
              </div>
              <div class="flex items-center">
                <span
                  class="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded gap-2">
                  <span class="material-icons align-middle text-base">layers</span>
                  {{ recipe.stages.length }}
                </span>
                <span
                  class="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded gap-2">
                  <span class="material-icons align-middle text-base">extension</span>
                  {{ getModulesCount(recipe.stages) }}
                </span>
                <span
                  class="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded gap-2">
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
      class="fixed bottom-16 right-0 m-8 max-w-sm w-full bg-yellow-300 text-yellow-900 p-4 rounded-lg shadow-lg">
      <div class="flex justify-between items-center">
        <p class="font-bold">Warning</p>
        <button class="bg-transparent text-2xl" aria-label="close" @click="hideWarning">&#10005;</button>
      </div>
      <p>Your local data is older than <u>12 hours</u>, which means that you may not see the latest recipes. Do you want
        to update it now?</p>
      <button class="mt-2 py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600" @click="updateCache">Update
        cache</button>
    </div>
  </transition>

</template>


<script lang="ts">
import { defineComponent } from "vue";
import { useAtlasStore } from "@/core/store";

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      cacheIsOld: false,
      refreshCacheTimer: 0,
      messageHidden: false,
    };
  },
  setup() {
    const atlasStore = useAtlasStore();
    return { atlasStore };
  },
  async beforeMount() {
    this.fetchRecipes();
    this.setCacheRefreshTimer();
  },
  methods: {
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
    getModulesCount(stages: any[]) {
      let result = 0;

      for (const stage of stages) {
        if (!stage.modules) continue;

        console.log(stage.modules);

        for (const module of stage.modules) {
          if (module.modules && module.modules.length > 0) {
            result += module.modules.length;
          } else {
            result++;
          }
        }
      }

      return result;
    },
    getRunsCount(stages: any[]) {
      let result = 0;

      stages.forEach((stage) => {
        if (!stage.runs) return;
        result += stage.runs.length;
      });

      return result;
    },
  },
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
