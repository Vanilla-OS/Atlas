<template>
  <div v-if="recipes.length">
    <section class="hero">
      <div class="hero-body">
        <p class="title">Vib Images</p>
        <p class="subtitle">There are {{ recipes.length }} recipes available.</p>
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
      <div class="flex-grid-item" v-for="(recipe, index) in recipes" :key="index">
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
import { defineComponent } from 'vue';
import AtlasManager from '@/core/manager';
import type { VibRecipe } from '@/core/models';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      recipes: [] as VibRecipe[],
      cacheIsOld: false,
      refreshCacheTimer: 0,
    };
  },
  async mounted() {
    try {
      this.recipes = await AtlasManager.getVibRecipes();
      this.checkCacheOld();
      this.setCacheRefreshTimer();
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  },
  beforeUnmount() {
    if (this.refreshCacheTimer != 0) {
      window.clearInterval(this.refreshCacheTimer);
      this.refreshCacheTimer = 0;
    }
  },
  methods: {
    setCacheRefreshTimer() {
      if (this.refreshCacheTimer != 0) { return; }

      this.refreshCacheTimer = window.setInterval(() => {
        this.checkCacheOld();
      }, 1000 * 60);
    },
    async updateCache() {
      try {
        this.recipes = [];
        this.recipes = await AtlasManager.getVibRecipes(true);
        this.cacheIsOld = false;
      } catch (error) {
        console.error('Error updating cache:', error);
      }
    },
    checkCacheOld() {
      let fetchDate = AtlasManager.getFetchDate();
      if (fetchDate) {
        let now = new Date();
        let diff = now.getTime() - fetchDate.getTime();
        if (diff > 1000 * 60 * 60 * 12) {
          this.cacheIsOld = true;
        }
      }
    },
  },
});
</script>
