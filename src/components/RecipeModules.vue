<template>
    <div class="py-4">
        <div v-if="!moduleDetails">
            <div class="flex items-center">
                <span class="material-icons text-gray-500 text-lg">search</span>
                <input class="form-input ml-2 border rounded p-2 flex-grow" type="search" v-model="searchQuery"
                    placeholder="Search modules" />
            </div>

            <div v-for="(group, groupIndex) in moduleGroups" :key="groupIndex">
                <h2 class="text-xl font-bold py-4" v-if="groupIndex != 'nested'">Stage "{{ groupIndex }}"</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                </th>
                            </tr>
                        </thead>
                        <tbody v-for="(module, index) in group" :key="index" class="bg-white divide-y divide-gray-200">
                            <tr :class="hasNestedModules(module) ? 'bg-gray-100' : ''">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <span v-if="hasNestedModules(module)" @click="toggleNested(module)">
                                            <i class="material-icons cursor-pointer">
                                                {{ isNestedExpanded(module) ? 'keyboard_arrow_down' :
                                                'keyboard_arrow_right'
                                                }}
                                            </i>
                                        </span>
                                        {{ module.name }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <span
                                            class="inline-flex items-center text-xs font-medium mr-2 px-2.5 py-0.5 rounded gap-2"
                                            :class="getModuleTypeColors(module.type)">
                                            <span class="material-icons align-middle text-base">
                                                {{ getModuleTypeClass(module.type) }}
                                            </span>
                                            {{ module.type }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div class="flex items-center space-x-2">
                                        <button class="py-2 px-3 rounded" @click="showModuleDetails(module)"
                                            title="Show module details">
                                            <i class="material-icons text-md">list</i>
                                        </button>
                                        <copy-btn :textToCopy="getRouteToModule(module)"
                                            title="Copy link to module"></copy-btn>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="hasNestedModules(module) && isNestedExpanded(module)" class="bg-gray-50">
                                <td colspan="3" class="px-6 py-4 whitespace-nowrap">
                                    <recipe-modules :recipe="module" :moduleDetails="moduleDetails"
                                        @showModuleDetails="showModuleDetails"
                                        @closeModuleDetails="goBack"></recipe-modules>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
        <div v-else>
            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li>
                        <a @click="goBack">
                            <span class="icon">
                                <i class="material-icons">arrow_back</i>
                            </span>
                            <span>Back</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div class="block">
                <h3 class="title is-3">
                    {{ moduleDetails.name }}
                    <copy-btn :textToCopy="getRouteToModule(moduleDetails)" title="Copy link to module"></copy-btn>
                </h3>
                <p class="subtitle is-4">Module of type
                    <span class="badge">
                        <span class="mdi material-icons">{{ getModuleTypeClass(moduleDetails.type) }}</span>
                        <span>{{ moduleDetails.type }}</span>
                    </span>
                </p>
            </div>

            <div class="block">
                <h4 class="title is-4">Snippet</h4>
                <pre class="block" v-highlight:yaml><code>{{ toYaml(moduleDetails) }}</code></pre>
            </div>

            <div v-if="moduleDetails.path">
                <b>Path:</b> {{ moduleDetails.path }}
            </div>

            <div v-if="moduleDetails.source" class="block">
                <h4 class="title is-4">Source</h4>
                <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th><abbr>Key</abbr></th>
                            <th><abbr>Value</abbr></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(value, key) in moduleDetails.source" :key="key">
                            <th>{{ key }}</th>
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

            <div v-if="moduleDetails.buildFlags" class="block">
                <h4 class="title is-4">Build Flags</h4>
                <ul>
                    <li v-for="(value, key) in moduleDetails.buildFlags" :key="key">
                        <span>{{ key }}</span>
                    </li>
                </ul>
            </div>

            <div v-if="moduleDetails.buildvars" class="block">
                <h4 class="title is-4">Build Vars</h4>
                <ul>
                    <li v-for="(value, key) in moduleDetails.buildvars" :key="key">
                        <span>{{ key }}</span>
                    </li>
                </ul>
            </div>

            <div v-if="moduleDetails.commands" class="block">
                <h4 class="title is-4">Commands</h4>
                <ul>
                    <li v-for="(value, key) in moduleDetails.commands" :key="key">
                        <pre class="block" v-highlight:bash><code>{{ value }}</code></pre>
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
