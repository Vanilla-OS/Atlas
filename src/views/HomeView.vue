<template>
  <div v-if="recipes.length">
    <section class="hero">
      <div class="hero-body">
        <p class="title">Vib Images</p>
        <p class="subtitle">There are {{ recipes.length }} recipes available.</p>
      </div>
    </section>

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
    Loading...
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AtlasManager from '@/core/manager';
import type { VibRecipe } from '@/core/models';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      recipes: [] as VibRecipe[],
    };
  },
  async mounted() {
    try {
      this.recipes = await AtlasManager.getVibRecipes();
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  },
});
</script>
