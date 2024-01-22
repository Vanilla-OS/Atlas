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
                <button class="button is-light" @click="setLayout"
                  :title="atlasStore.layout == 'list' ? 'Switch to grid view' : 'Switch to list view'"
                  v-if="route.name == 'home'">
                  <span class="icon is-small">
                    <i class="mdi material-icons" v-if="atlasStore.layout == 'list'">view_list</i>
                    <i class="mdi material-icons" v-else>view_module</i>
                  </span>
                </button>
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