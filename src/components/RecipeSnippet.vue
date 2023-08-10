<template>
    <div>
        <article class="message is-info">
            <div class="message-body">
                This is the expanded version of the recipe, for the original version click the Source tab from the
                navigation menu.
            </div>
        </article>
        <pre class="block" v-highlight:yaml><code>{{ toYaml(recipe) }}</code></pre>
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