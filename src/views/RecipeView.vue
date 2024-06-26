<template>
    <div v-if="recipe">
        <section class="bg-gray-100 dark:bg-gray-800 py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div>
                    <p class="text-3xl font-bold text-black dark:text-gray-200">{{ recipe.name }}</p>
                    <p class="text-xl text-gray-600 dark:text-gray-400">{{ recipe.repo }}</p>
                </div>
                <div class="">
                    <div class="flex gap-2 mb-2">
                        <button class="py-1 px-3 text-sm rounded focus:outline-none"
                            :class="{ 'bg-gray-200 text-gray-900': pullType === 'podman', 'bg-transparent text-gray-700': pullType !== 'podman' }"
                            @click="pullType = 'podman'">Podman</button>
                        <button class="py-1 px-3 text-sm rounded focus:outline-none"
                            :class="{ 'bg-gray-200 text-gray-900': pullType === 'docker', 'bg-transparent text-gray-700': pullType !== 'docker' }"
                            @click="pullType = 'docker'">Docker</button>
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

            <RecipeDetails v-if="curTab === 'details'" :recipe="recipe" />

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
import RecipeDetails from "@/components/RecipeDetails.vue";
import RecipeSnippet from "@/components/RecipeSnippet.vue";
import RecipeModules from "@/components/RecipeModules.vue";
import RecipeRuns from "@/components/RecipeRuns.vue";

export default defineComponent({
    name: "RecipeView",
    components: {
        CopyBtn,
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
            pullType: 'podman',
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
            return `${AtlasConfig.publicRegistry}/${this.recipe.repo}`.toLowerCase();
        },
        pullCommand() {
            const baseCommand = `pull ${AtlasConfig.pullRegistry}/${this.recipe?.id}:${AtlasConfig.pullBranch}`.toLowerCase();
            return this.pullType === 'docker' ? `docker ${baseCommand}` : `podman ${baseCommand}`;
        },
    },
});
</script>
