<template>
    <div>
        <pre class="block" v-highlight-yaml><code>{{ recipe.snippet }}</code></pre>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { VibRecipe } from "@/core/models";

export default defineComponent({
    name: "RecipeSnippet",
    props: {
        recipe: {
            type: Object as () => VibRecipe,
            required: true,
        },
    },
});
</script>