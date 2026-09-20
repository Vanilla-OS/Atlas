<template>
  <br>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error" style="color: red;">{{ error }}</div>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-else class="markdown-body" v-html="renderedMarkdown" />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import MarkdownIt from 'markdown-it';
import 'github-markdown-css/github-markdown.css';
import MarkdownItGitHubAlerts from "markdown-it-github-alerts";

const md = new MarkdownIt({ html: false, linkify: true, typographer: true }).use(MarkdownItGitHubAlerts);

export default defineComponent({
  name: 'RecipeReadme',
  props: {
    recipeSourceUrl: { type: String, required: true },
    git_branch: { type: String, default: 'main' },
  },
  setup(props) {
    const src = ref('');
    const loading = ref(false);
    const error = ref('');

    const renderedMarkdown = computed(() => md.render(src.value));

    onMounted(async () => {
      loading.value = true;
      try {
        const res = await fetch(props.recipeSourceUrl+"/"+props.git_branch+"/README.md");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        src.value = await res.text();
      } catch (e: any) {
        error.value = e.message || 'Failed';
      } finally {
        loading.value = false;
      }
    });

    return { renderedMarkdown, loading, error };
  },
});
</script>