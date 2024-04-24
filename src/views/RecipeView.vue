<template>
    <div v-if="recipe">
        <section class="hero">
            <div class="hero-body">
                <p class="title">{{ recipe.name }}</p>
                <p class="subtitle">{{ recipe.repo }}</p>
            </div>
        </section>

        <div class="tabs">
            <ul>
                <li :class="{ 'is-active': curTab === 'details' }">
                    <a @click="curTab = 'details'">Details</a>
                </li>
                <li :class="{ 'is-active': curTab === 'snippet' }">
                    <a @click="curTab = 'snippet'">Recipe</a>
                </li>
                <li :class="{ 'is-active': curTab === 'modules' }">
                    <a @click="curTab = 'modules'">Modules</a>
                </li>
                <li :class="{ 'is-active': curTab === 'runs' }">
                    <a @click="curTab = 'runs'">Runs</a>
                </li>
                <li>
                    <a :href="recipeSourceUrl" target="_blank">
                        <span>Source</span>
                        <span class="icon is-small">
                            <i class="mdi material-icons">open_in_new</i>
                        </span>
                    </a>
                </li>
            </ul>
        </div>

        <RecipeDetails v-if="curTab === 'details'" :recipe="recipe" />

        <RecipeSnippet v-else-if="curTab === 'snippet'" :recipe="recipe" />

        <RecipeModules v-if="curTab === 'modules' && !moduleDetails" :recipe="recipe"
            @showModuleDetails="showModuleDetails" @closeModuleDetails="moduleDetails = null" />

        <RecipeModules v-else-if="curTab === 'modules' && moduleDetails" :recipe="recipe" :moduleDetails="moduleDetails"
            @showModuleDetails="showModuleDetails" @closeModuleDetails="moduleDetails = null" />

        <RecipeRuns v-if="curTab === 'runs'" :recipe="recipe" />
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import type { Module, VibRecipe } from "@/core/models";
import { useAtlasStore } from "@/core/store";
import AtlasConfig from "@/config";

import RecipeDetails from "@/components/RecipeDetails.vue";
import RecipeSnippet from "@/components/RecipeSnippet.vue";
import RecipeModules from "@/components/RecipeModules.vue";
import RecipeRuns from "@/components/RecipeRuns.vue";

export default defineComponent({
    name: "RecipeView",
    components: {
        RecipeDetails,
        RecipeSnippet,
        RecipeModules,
        RecipeRuns,
    },
    setup() {
        const atlasStore = useAtlasStore();
        return { atlasStore };
    },
    data() {
        return {
            recipe: null as any,
            curTab: "details",
            moduleDetails: null as any,
        };
    },
    async mounted() {
        const router = useRouter();
        const { id, module } = router.currentRoute.value.params;

        try {
            // @ts-ignore
            this.recipe = await this.atlasStore.getVibRecipe(id);
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }

        if (module && this.recipe?.modules) {
            this.curTab = "modules";

            try {
                for (const mod of this.recipe.modules) {
                    if (mod.name === module) {
                        this.moduleDetails = mod;
                        break;
                    }
                }
            } catch (error) {
                console.error("Error fetching module details:", error);
            }
        }
    },
    methods: {
        showModuleDetails(module: any) {
            this.moduleDetails = module;
        },
    },
    computed: {
        recipeSourceUrl() {
            if (!this.recipe) {
                return "";
            }
            return `${AtlasConfig.publicRegistry}/${this.recipe.repo}`;
        },
    },
});
</script>