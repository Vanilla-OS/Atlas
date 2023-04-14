<template>
  <div class="container">
    <header>
      <span class="logo">{{ title }}</span>
      <ul>
        <li><router-link to="/">Images</router-link></li>
        <li><a href="https://github.com/vanilla-os">GitHub</a></li>
      </ul>
    </header>
  </div>

  <div class="container">
    <router-view />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import AtlasConfig from "./config";

  export default defineComponent({
    name: "App",
    data() {
      return {
        title: "",
      };
    },
    mounted() {
      this.title = AtlasConfig.title;
    },
  });
</script>