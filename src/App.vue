<template>
  <div class="topbar">
    <div class="container">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-item">
            <img src="/atlas-logo.svg" width="112" height="28">
          </router-link>
        </div>
        <div class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <button class="button is-light" @click="updateCache" title="Refresh">
                  <span class="icon is-small">
                    <i class="mdi material-icons">refresh</i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>

  <div class="container">
    <router-view />
  </div>

  <br />
  <br />

  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Atlas</strong> by <a href="https://vanillaos.org">Vanilla OS</a>.
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
  setup() {
    const atlasStore = useAtlasStore();
    return { atlasStore };
  },
  mounted() {
    this.title = AtlasConfig.title;
  },
  methods: {
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