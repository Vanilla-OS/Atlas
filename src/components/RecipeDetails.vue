<template>
    <div>
        <div class="columns">
            <div class="column">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span class="icon">
                                <i class="material-icons">extension</i>
                            </span>
                            <span>Modules</span>
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <span class="title is-1">
                                {{ recipe.modules.length }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column" v-if="recipe.labels">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span class="icon">
                                <i class="material-icons">label</i>
                            </span>
                            <span>Labels</span>
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <span class="title is-1">
                                {{ Object.keys(recipe.labels).length }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column" v-if="recipe.args">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span class="icon">
                                <i class="material-icons">settings</i>
                            </span>
                            <span>Args</span>
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <span class="title is-1">
                                {{ Object.keys(recipe.args).length }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column" v-if="recipe.runs">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            <span class="icon">
                                <i class="material-icons">play_arrow</i>
                            </span>
                            <span>Runs</span>
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <span class="title is-1">
                                {{ recipe.runs.length }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div v-if="recipe.modules.length">
            <div class="block">
                <h3 class="title is-3">Modules Usage</h3>
            </div>

            <div class="block">
                <div class="bar-chart">
                    <div v-for="(moduleType, index) in chartData.labels" :key="index" class="bar-segment"
                        :style="{ height: getSegmentHeight(moduleType) + '%' }">
                        <span>{{ moduleType }} ({{ chartData.datasets[0].data[index] }})</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "RecipeView",
    props: {
        recipe: {
            type: Object,
            required: true,
        },
    },
    computed: {
        chartData() {
            const moduleTypesCount: Record<string, number> = {};
            for (const module of this.recipe.modules) {
                const moduleType = module.type;
                moduleTypesCount[moduleType] = (moduleTypesCount[moduleType] || 0) + 1;
            }
            return {
                labels: Object.keys(moduleTypesCount),
                datasets: [
                    {
                        // @ts-ignore
                        data: Object.values(moduleTypesCount),
                    },
                ],
            };
        },
    },
    methods: {
        getSegmentHeight(moduleType: string) {
            const moduleCount = this.chartData.datasets[0].data[this.chartData.labels.indexOf(moduleType)];
            const totalModules = this.recipe.modules.length;
            const res = (moduleCount / totalModules) * 100;
            if (res < 9) {
                return 9;
            }
            return res;
        },
    },
});
</script>