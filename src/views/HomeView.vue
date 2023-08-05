<template>
  <div v-if="atlasStore.vibRecipes.length">
    <section class="hero">
      <div class="hero-body">
        <p class="title">Vib Images</p>
        <p class="subtitle">There are {{ atlasStore.vibRecipes.length }} recipes available.</p>
      </div>
    </section>

    <article class="message is-warning" v-if="cacheIsOld">
      <div class="message-header">
        <p>Warning</p>
        <button class="delete" aria-label="delete"></button>
      </div>
      <div class="message-body">
        Your local data is old than <u>12 hours</u>, which means that you may not see
        the latest recipes. Do you want to update it now?
        <br />
        <br />
        <button class="button is-warning" @click="updateCache">Update cache</button>
      </div>
    </article>

    <div class="flex-grid">
      <div class="flex-grid-item" v-for="(recipe, index) in atlasStore.vibRecipes" :key="index">
        <router-link :to="{ name: 'recipe', params: { id: recipe.id } }">
          <div class="card">
            <header class="card-header">
              <div class="card-header-title flex-list">
                <p>{{ recipe.name }}</p>
                <p class="subtitle is-6">{{ recipe.base }}</p>
              </div>
            </header>
            <div class="card-content">
              <div class="content badges">
                <span class="badge">
                  <span class="mdi material-icons">extension</span>
                  {{ recipe.modules.length }}
                </span>
                <span class="badge" v-if="recipe.runs">
                  <span class="mdi material-icons">terminal</span>
                  {{ recipe.runs.length }}
                </span>
                <span class="badge" v-if="recipe.labels" v-for="label in Object.keys(recipe.labels)">
                  {{ label }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
  <div v-else>
    <section class="hero">
      <div class="hero-body">
        <p class="title">Loading...</p>
        <p class="subtitle">Please wait while we fetch the recipes.</p>
      </div>
    </section>
  </div>
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
        this.recipes = this.atlasStore.vibRecipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
    checkCacheOld() {
      console.log("Checking cache status..");
      const lastFetchTimestamp = this.atlasStore.lastFetchDate;
      if (lastFetchTimestamp) {
        const lastFetchDate = new Date(lastFetchTimestamp); // Convert timestamp to Date object
        const now = new Date();
        const diff = now.getTime() - lastFetchDate.getTime();
        this.cacheIsOld = diff > 1000 * 60 * 60 * 12;
      }
    },
    async updateCache() {
      try {
        this.cacheIsOld = false;
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
  },
});
</script>
