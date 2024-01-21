<template>
  <div v-if="atlasStore.vibRecipes">
    <nav class="navbar">
      <div class="navbar-brand">
        <button class="button navbar-item" @click="toggleView">
          <span class="icon is-small">
            <i class="mdi material-icons" v-if="isGridView">view_list</i>
            <i class="mdi material-icons" v-else>view_module</i>
          </span>
        </button>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-body">
        <p class="title">Vib Images</p>
        <p class="subtitle">There are {{ atlasStore.vibRecipes.length }} recipes available.</p>
      </div>
    </section>

    <article class="message is-warning" v-if="cacheIsOld && !messageHidden">
      <div class="message-header">
        <p>Warning</p>
        <button class="delete" aria-label="delete" @click="hideWarning"></button>
      </div>
      <div class="message-body">
        Your local data is older than <u>12 hours</u>, which means that you may not see
        the latest recipes. Do you want to update it now?
        <br />
        <br />
        <button class="button is-warning" @click="updateCache">Update cache</button>
      </div>
    </article>

    <div :class="{ 'flex-list': !isGridView, 'flex-grid': isGridView }">
      <div v-for="(recipe, index) in atlasStore.vibRecipes" :key="index"
        :class="{ 'flex-list-item': !isGridView, 'flex-grid-item': isGridView }" class="recipe-card">
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
      messageHidden: false,
      isGridView: true,
    };
  },
  setup() {
    const atlasStore = useAtlasStore();
    return { atlasStore };
  },
  async beforeMount() {
    this.setLayout();
    this.fetchRecipes();
    this.setCacheRefreshTimer();
  },
  methods: {
    setLayout() {
      const layout = this.atlasStore.layout;
      this.isGridView = layout === "grid";
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
    toggleView() {
      this.isGridView = !this.isGridView;
      this.atlasStore.$patch((state) => {
        state.layout = this.isGridView ? "grid" : "list";
      });
    },
  },
});
</script>