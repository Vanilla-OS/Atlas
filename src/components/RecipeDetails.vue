<template>
    <div class="flex flex-wrap py-4">
        <div class="flex flex-col w-full lg:w-1/3 p-2">
            <div class="w-full p-2">
                <div class="bg-white rounded shadow flex justify-between items-center p-4">
                    <div class="flex items-center">
                        <i class="material-icons text-gray-700 mr-2">extension</i>
                        <span class="font-semibold">Modules</span>
                    </div>
                    <span class="text-4xl">{{ getAllModulesCount() }}</span>
                </div>
            </div>
            <div class="w-full p-2">
                <div class="bg-white rounded shadow flex justify-between items-center p-4">
                    <div class="flex items-center">
                        <i class="material-icons text-gray-700 mr-2">layers</i>
                        <span class="font-semibold">Stages</span>
                    </div>
                    <span class="text-4xl">{{ recipe.stages.length }}</span>
                </div>
            </div>
            <div class="w-full p-2">
                <div class="bg-white rounded shadow flex justify-between items-center p-4">
                    <div class="flex items-center">
                        <i class="material-icons text-gray-700 mr-2">settings</i>
                        <span class="font-semibold">Args</span>
                    </div>
                    <span class="text-4xl">{{ getArgsCount() }}</span>
                </div>
            </div>
            <div class="w-full p-2">
                <div class="bg-white rounded shadow flex justify-between items-center p-4">
                    <div class="flex items-center">
                        <i class="material-icons text-gray-700 mr-2">play_arrow</i>
                        <span class="font-semibold">Runs</span>
                    </div>
                    <span class="text-4xl">{{ getRunsCount() }}</span>
                </div>
            </div>
        </div>
        <div class="w-full lg:w-2/3 p-2">
            <div class="bg-white rounded shadow">
                <div class="p-4 flex items-center">
                    <i class="material-icons text-gray-700 mr-2">pie_chart</i>
                    <span class="font-semibold">Modules Usage</span>
                </div>
                <div class="p-4 text-center">
                    <canvas id="modulesPieChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Stage } from "@/core/models";
import Chart from 'chart.js/auto';

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
            this.recipe.stages.forEach((stage: Stage) => {
                stage.modules.forEach(module => {
                    const moduleType = module.type;
                    moduleTypesCount[moduleType] = (moduleTypesCount[moduleType] || 0) + 1;

                    if (module.modules) {
                        // @ts-ignore
                        for (const subModule of module.modules) {
                            const subModuleType = subModule.type;
                            moduleTypesCount[subModuleType] = (moduleTypesCount[subModuleType] || 0) + 1;
                        }
                    }
                });
            });
            return {
                labels: Object.keys(moduleTypesCount),
                datasets: [{
                    // @ts-ignore
                    data: Object.values(moduleTypesCount),
                }],
            };
        },
    },
    methods: {
        initChart() {
            // @ts-ignore
            const ctx = document.getElementById('modulesPieChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: this.chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                boxWidth: 10,
                                usePointStyle: true
                            }
                        }
                    }
                }
            });
        },
        getModulesCount() {
            let result = 0;

            for (const stage of this.recipe.stages) {
                if (!stage.modules) return;
                result += stage.modules.length;
            }

            return result;
        },
        getRunsCount() {
            let result = 0;

            for (const stage of this.recipe.stages) {
                if (!stage.runs) return;
                result += stage.runs.length;
            }

            return result;
        },
        getAllModulesCount() {
            let result = 0;

            for (const stage of this.recipe.stages) {
                if (!stage.modules) continue;

                console.log(stage.modules);

                for (const module of stage.modules) {
                    if (module.modules && module.modules.length > 0) {
                        result += module.modules.length;
                    } else {
                        result++;
                    }
                }
            }

            return result;
        },
        getArgsCount() {
            let result = 0;

            for (const arg of this.recipe.stages) {
                if (!arg.args) continue;
                result += Object.keys(arg.args).length;
            }

            return result;
        }
    },
    mounted() {
        this.initChart();
    },
});
</script>

<style scoped>
.canvas-container {
    position: relative;
    height: 40vh;
    width: 100%;
}
</style>
