<template>
    <div>
        <pre class="block" v-highlight-yaml><code>{{ toYaml(recipe) }}</code></pre>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { VibRecipe } from "@/core/models";
import * as yaml from "js-yaml";


export default defineComponent({
    name: "RecipeSnippet",
    props: {
        recipe: {
            type: Object as () => VibRecipe,
            required: true,
        },
    },
    methods: {
        toYaml(obj: any) {
            return yaml.dump(obj);
        },
    },
});
</script>