<template>
    <div class="py-4">
        <div v-if="!moduleDetails">
            <div class="flex items-center mb-4 gap-2">
                <span class="material-icons text-gray-500 dark:text-gray-200 text-lg">search</span>
                <input
                    class="bg-white dark:bg-gray-700 p-2 rounded text-sm border border-gray-300 shadow focus:outline-none flex-1"
                    type="search" v-model="searchQuery" placeholder="Search modules" />
            </div>

            <div v-for="(group, groupIndex) in moduleGroups" :key="groupIndex">
                <h2 class="text-xl font-bold mb-4 dark:text-white" v-if="groupIndex != 'nested'">Stage "{{ groupIndex }}"</h2>
                <div class="flex flex-col gap-4">
                    <div v-for="(module, index) in group.filter(module => module.name.toLowerCase().includes(searchQuery.toLowerCase()))"
                        :key="index" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-all">
                        <div class="py-2 px-6">
                            <div class="flex items-center justify-between">
                                <i class="material-icons cursor-pointer" v-if="hasNestedModules(module)"
                                    @click="toggleNested(module)"
                                    :title="isNestedExpanded(module) ? 'Collapse child modules' : 'Expand child modules'">
                                    {{ isNestedExpanded(module) ? 'keyboard_arrow_down' :
                                        'keyboard_arrow_right' }}
                                </i>
                                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 flex-1">{{ module.name }}</h3>
                                <span class="inline-flex items-center mr-2 px-2.5 py-0.5 rounded gap-2"
                                    :class="getModuleTypeColors(module.type)">
                                    <span class="material-icons align-middle text-base">{{
                                        getModuleTypeClass(module.type) }}</span>
                                    {{ module.type }}
                                </span>
                                <button class="py-2 px-3 rounded mr-2" @click="showModuleDetails(module)"
                                    title="Show module details">
                                    <i class="material-icons text-md dark:text-gray-100">list</i>
                                </button>
                                <copy-btn :textToCopy="getRouteToModule(module)" title="Copy link to module"></copy-btn>
                            </div>
                        </div>
                        <div v-if="hasNestedModules(module) && isNestedExpanded(module)"
                            class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-900 p-4 mx-4 mb-4 rounded-lg shadow-md flex-1">
                            <recipe-modules :recipe="module" :moduleDetails="moduleDetails"
                                @showModuleDetails="showModuleDetails" @closeModuleDetails="goBack"></recipe-modules>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <div v-else>
            <nav class="flex items-center space-x-2" aria-label="breadcrumbs">
                <ul class="flex">
                    <li>
                        <a @click="goBack"
                            class="flex items-center space-x-1 text-blue-600 hover:text-blue-800 cursor-pointer">
                            <i class="material-icons">arrow_back</i>
                            <span>Back</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div>
                <h3 class="text-3xl font-bold mt-4">
                    {{ moduleDetails.name }}
                    <copy-btn :textToCopy="getRouteToModule(moduleDetails)" title="Copy link to module"></copy-btn>
                </h3>
                <p class="text-xl mt-1 flex gap-2">Module of type
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium"
                        :class="getModuleTypeColors(moduleDetails.type)">
                        <i class="mdi material-icons">{{ getModuleTypeClass(moduleDetails.type) }}</i>
                        <span>{{ moduleDetails.type }}</span>
                    </span>
                </p>
            </div>

            <div>
                <h4 class="text-xl font-bold mt-4 mb-4">Snippet</h4>
                <div class="snippet rounded shadow p-4">
                    <div class="overflow-x-auto">
                        <pre class="block" v-highlight:yaml><code>{{ toYaml(moduleDetails) }}</code></pre>
                    </div>
                </div>
            </div>

            <div v-if="moduleDetails.path" class="mt-4">
                <strong>Path:</strong> {{ moduleDetails.path }}
            </div>

            <div v-if="moduleDetails.source" class="mt-4">
                <h4 class="text-xl font-bold mb-4">Source</h4>
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Key</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(value, key) in moduleDetails.source" :key="key">
                            <th class="px-6 py-4 whitespace-nowrap">{{ key }}</th>
                            <td v-if="typeof value === 'string'">{{ value }}</td>
                            <td v-else-if="typeof value === 'object'">
                                <ul>
                                    <li v-for="(v, k) in value" :key="k">{{ v }}</li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="moduleDetails.buildFlags" class="mt-4">
                <h4 class="text-xl font-bold mb-4">Build Flags</h4>
                <ul>
                    <li v-for="(value, key) in moduleDetails.buildFlags" :key="key">
                        <span>{{ key }}</span>
                    </li>
                </ul>
            </div>

            <div v-if="moduleDetails.buildvars" class="mt-4">
                <h4 class="text-xl font-bold mb-4">Build Vars</h4>
                <ul>
                    <li v-for="(value, key) in moduleDetails.buildvars" :key="key">
                        <span>{{ key }}</span>
                    </li>
                </ul>
            </div>

            <div v-if="moduleDetails.commands" class="mt-4">
                <h4 class="text-xl font-bold mb-4">Commands</h4>
                <ul class="flex flex-col gap-4">
                    <li v-for="(value, key) in moduleDetails.commands" :key="key">
                        <pre class="snippet rounded p-4 overflow-x-auto" v-highlight:bash><code>{{ value }}</code></pre>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import atlasHelpers from "@/core/helpers";
import type { Module, Stage } from "@/core/models";
import * as yaml from "js-yaml";
import { defineComponent } from "vue";
import CopyBtn from "./CopyBtn.vue";
import AtlasConfig from "@/config";

export default defineComponent({
    components: {
        CopyBtn,
    },
    props: {
        recipe: {
            type: Object,
            required: true,
        },
        moduleDetails: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            searchQuery: "",
            expandedModules: [] as Module[],
            moduleGroups: {} as Record<string, Module[]>,
        };
    },
    mounted() {
        if (!this.recipe.stages) {
            this.moduleGroups["nested"] = this.recipe.modules;
            return;
        }
        this.recipe.stages.forEach((stage: Stage) => {
            this.moduleGroups[stage.id] = stage.modules;
        });
    },
    methods: {
        showModuleDetails(module: any) {
            this.$emit("showModuleDetails", module);
        },
        goBack() {
            this.$emit("closeModuleDetails");
        },
        getModuleTypeClass(type: string) {
            return atlasHelpers.getModuleTypeClass(type);
        },
        getModuleTypeColors(type: string) {
            return atlasHelpers.getModuleTypeColors(type);
        },
        hasNestedModules(module: Module) {
            return module.modules && Array.isArray(module.modules) && module.modules.length > 0;
        },
        isNestedExpanded(module: Module) {
            return this.expandedModules.includes(module);
        },
        toggleNested(module: Module) {
            if (this.isNestedExpanded(module)) {
                this.expandedModules = this.expandedModules.filter((m) => m !== module);
            } else {
                this.expandedModules.push(module);
            }
        },
        toYaml(obj: any) {
            return yaml.dump(obj);
        },
        getRouteToModule(module: any) {
            return `${AtlasConfig.publicUrl}/recipes/${this.recipe.id}/modules/${module.name}`;
        },
    },
});
</script>

<style scoped>
.snippet {
    background-color: #282c34;
}
</style>
