<template>
    <div class="flex flex-col gap-4 pt-5">
        <div class="bg-blue-800 text-white px-4 py-3 rounded relative">
            <span class="block sm:inline">This is the expanded version of the recipe, for the original version click the
                Source tab from the navigation menu.</span>
        </div>
        <div class="snippet rounded shadow p-4">
            <pre class="block" v-highlight:yaml><code>{{ toYaml(recipe) }}</code></pre>
        </div>
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

<style scoped>
.snippet {
    background-color: #282c34;
}
</style>