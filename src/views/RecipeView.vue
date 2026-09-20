<template>
    <div v-if="recipe">
        <section class="bg-gray-100 dark:bg-gray-800 py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div>
                    <div class="text-3xl font-bold text-black dark:text-gray-200 flex items-center gap-3">
                        {{ recipe.name }}
                        <RecipeStatusBadge :recipe="recipe" size="lg" />
                    </div>
                    <p class="text-xl text-gray-600 dark:text-gray-400">{{ recipe.repo }}</p>

                    <div v-if="recipe.de || recipe.hardware" class="flex flex-wrap gap-3 mt-3 text-sm">
                        <span v-if="recipe.de" 
                              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <font-awesome-icon :icon="['fas', 'desktop']" class="text-xs" />
                            <span class="font-medium">DE:</span> {{ recipe.de }}
                        </span>
                        
                        <span v-if="recipe.hardware" 
                              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <font-awesome-icon :icon="['fas', 'microchip']" class="text-xs" />
                            <span class="font-medium">Hardware:</span> {{ recipe.hardware }}
                        </span>
                    </div>

                </div>
                <div class="">
                    <div class="flex gap-2 mb-2">
                        <button v-for="option in pullOptions" :key="option.id"
                            class="py-1 px-3 text-sm rounded focus:outline-none"
                            :class="{ 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-200': pullType === option.id, 'bg-transparent text-gray-700 dark:text-gray-400': pullType !== option.id }"
                            @click="pullType = option.id">{{ option.label }}</button>
                    </div>
                    <div class="flex gap-2">
                        <div
                            class="bg-white dark:bg-gray-700 p-2 rounded text-sm border border-gray-300 shadow focus:outline-none flex-1">
                            <p class="text-gray-700 dark:text-gray-200">{{ pullCommand }}</p>
                        </div>
                        <copy-btn :textToCopy="pullCommand" type="lg" title="Copy pull command" />
                    </div>
                    <p class="text-xs text-left text-gray-500 dark:text-gray-400 mt-2">
                        This image might not be meant to be used directly.
                    </p>
                </div>
            </div>
        </section>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow relative overflow-hidden">
                <ul class="flex divide-x divide-gray-200 dark:divide-gray-700">
                    <li class="cursor-pointer flex-grow text-center"
                        :class="{ 'bg-gray-200 dark:bg-gray-700': curTab === 'readme' }">
                        <a @click="curTab = 'readme'"
                            class="block py-4 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            :class="{ 'text-gray-900 dark:text-white': curTab === 'readme' }">Readme</a>
                    </li>
                    <li class="cursor-pointer flex-grow text-center"
                        :class="{ 'bg-gray-200 dark:bg-gray-700': curTab === 'details' }">
                        <a @click="curTab = 'details'"
                            class="block py-4 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            :class="{ 'text-gray-900 dark:text-white': curTab === 'details' }">Details</a>
                    </li>
                    <li class="cursor-pointer flex-grow text-center items-stretch"
                        :class="{ 'bg-gray-200 dark:bg-gray-700': curTab === 'snippet' }">
                        <a @click="curTab = 'snippet'"
                            class="flex justify-center py-4 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            :class="{ 'text-gray-900 dark:text-white': curTab === 'snippet' }">Recipe</a>
                    </li>
                    <li class="cursor-pointer flex-grow text-center items-stretch"
                        :class="{ 'bg-gray-200 dark:bg-gray-700': curTab === 'modules' }">
                        <a @click="curTab = 'modules'"
                            class="flex justify-center py-4 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            :class="{ 'text-gray-900 dark:text-white': curTab === 'modules' }">Modules</a>
                    </li>
                    <li class="cursor-pointer flex-grow text-center items-stretch"
                        :class="{ 'bg-gray-200 dark:bg-gray-700': curTab === 'runs' }">
                        <a @click="curTab = 'runs'"
                            class="flex justify-center py-4 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            :class="{ 'text-gray-900 dark:text-white': curTab === 'runs' }">Runs</a>
                    </li>
                    <li class="cursor-pointer flex-grow text-center items-stretch">
                        <a :href="recipeSourceUrl" target="_blank"
                            class="flex justify-center gap-2 py-4 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <span>Source</span>
                            <i class="material-icons text-sm">open_in_new</i>
                        </a>
                    </li>
                </ul>
            </div>

            <RecipeReadme v-if="curTab === 'readme'" :recipeSourceUrl="recipeRawUrl" :git_branch="recipeGitBranch" />

            <RecipeDetails v-else-if="curTab === 'details'" :recipe="recipe" />

            <RecipeSnippet v-else-if="curTab === 'snippet'" :recipe="recipe" />

            <RecipeModules v-if="curTab === 'modules' && !moduleDetails" :recipe="recipe"
                @showModuleDetails="showModuleDetails" @closeModuleDetails="moduleDetails = null" />

            <RecipeModules v-else-if="curTab === 'modules' && moduleDetails" :recipe="recipe"
                :moduleDetails="moduleDetails" @showModuleDetails="showModuleDetails"
                @closeModuleDetails="moduleDetails = null" />

            <RecipeRuns v-if="curTab === 'runs'" :recipe="recipe" />
        </div>
    </div>
    <div v-else>
        <div
            class="fixed bottom-0 right-0 m-8 max-w-sm w-full bg-blue-500 text-white py-4 px-6 rounded-lg shadow-lg text-center">
            <p class="text-xl">Loading...</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useAtlasStore } from "@/core/store";
import AtlasConfig from "@/config";

import CopyBtn from "@/components/CopyBtn.vue";
import RecipeReadme from "@/components/RecipeReadme.vue";
import RecipeDetails from "@/components/RecipeDetails.vue";
import RecipeSnippet from "@/components/RecipeSnippet.vue";
import RecipeModules from "@/components/RecipeModules.vue";
import RecipeRuns from "@/components/RecipeRuns.vue";
import RecipeStatusBadge from "@/components/RecipeStatusBadge.vue";

export default defineComponent({
    name: "RecipeView",
    components: {
        CopyBtn,
        RecipeReadme,
        RecipeDetails,
        RecipeSnippet,
        RecipeModules,
        RecipeRuns,
        RecipeStatusBadge,
    },
    setup() {
        const atlasStore = useAtlasStore();
        return { atlasStore };
    },
    data() {
        return {
            recipe: null as any,
            curTab: "readme",
            moduleDetails: null as any,
            pullType: 'abroot',
        };
    },
    async mounted() {
        const router = useRouter();
        const { id } = router.currentRoute.value.params;

        try {
            // @ts-ignore
            this.recipe = await this.atlasStore.getVibRecipe(id);
            this.pullType = this.pullOptions[0]?.id ?? '';
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    },
    methods: {
        showModuleDetails(module: any) {
            this.moduleDetails = module;
        },
    },
    computed: {
        pullOptions(): Array<{ id: string; label: string }> {
            if (this.recipe?.category === 'vib-recipes') {
                return [
                    { id: 'podman', label: 'Podman' },
                    { id: 'docker', label: 'Docker' },
                ];
            }
            return [{ id: 'abroot', label: 'ABRoot' }];
        },
        recipeSourceUrl() {
            if (!this.recipe) {
                return "";
            }
            return `${AtlasConfig.publicRegistry}/${this.recipe.repo}`.toLowerCase();
        },
        recipeRawUrl() {
            if (!this.recipe) {
                return "";
            }
            return `${AtlasConfig.registry}/${this.recipe.repo}`.toLowerCase();
        },
        recipeGitBranch() {
            if (!this.recipe) {
                return "";
            }
            return this.recipe.git_branch;
        },
        pullCommand() {
            const baseCommand = `${this.recipe?.image}:${this.recipe?.label}`.toLowerCase();
            if (this.pullType === 'docker') {
                return `docker pull ${baseCommand}`;
            } else if (this.pullType === 'podman') {
                return `podman pull ${baseCommand}`
            } else if (this.pullType === 'abroot') {
                return `abroot rebase ${baseCommand}`
            }

            return ``;
        }
    }
});
</script>
