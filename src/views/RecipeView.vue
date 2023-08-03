<template>
    <div v-if="recipe">
        <section class="hero">
            <div class="hero-body">
                <p class="title">{{ recipe.name }}</p>
                <p class="subtitle">Based on: {{ recipe.base }}</p>
            </div>
        </section>

        <div class="tabs">
            <ul>
                <li :class="{ 'is-active': curTab === 'details' }">
                    <a @click="curTab = 'details'">Details</a>
                </li>
                <li :class="{ 'is-active': curTab === 'modules' }">
                    <a @click="curTab = 'modules'">Modules</a>
                </li>
                <li :class="{ 'is-active': curTab === 'runs' }">
                    <a @click="curTab = 'runs'">Runs</a>
                </li>
            </ul>
        </div>

        <RecipeDetails v-if="curTab === 'details'" :recipe="recipe" />

        <RecipeModules v-if="curTab === 'modules' && !moduleDetails" :recipe="recipe" @showModuleDetails="showModuleDetails"
            @closeModuleDetails="moduleDetails = null" />

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
import type { VibRecipe } from "@/core/models";
import AtlasManager from "@/core/manager";

import RecipeDetails from "@/components/RecipeDetails.vue";
import RecipeModules from "@/components/RecipeModules.vue";
import RecipeRuns from "@/components/RecipeRuns.vue";

export default defineComponent({
    name: "RecipeView",
    components: {
        RecipeDetails,
        RecipeModules,
        RecipeRuns,
    },
    data() {
        return {
            recipe: null as VibRecipe | null,
            curTab: "details",
            moduleDetails: null as any,
        };
    },
    async mounted() {
        const router = useRouter();
        const { id } = router.currentRoute.value.params;
        try {
            // @ts-ignore
            this.recipe = await AtlasManager.getVibRecipe(id);
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    },
    methods: {
        showModuleDetails(module: any) {
            this.moduleDetails = module;
        },
    },
});
</script>