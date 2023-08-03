<template>
  <div>
    <ul v-if="recipes.length">
      <li v-for="(recipe, index) in recipes" :key="index">
        <h4>{{ recipe.name }}</h4>
        <b>Modules: {{ recipe.modules ? recipe.modules.length : 0 }}</b>
        <router-link :to="{ name: 'recipe', params: { id: recipe.id } }">
          View Recipe
        </router-link>
        <br />
        <br />
      </li>
    </ul>
    <div v-else>
      Loading...
    </div>
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
