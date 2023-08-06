<template>
    <div v-if="!moduleDetails">
        <div class="field">
            <div class="control has-icons-left">
                <span class="icon is-small is-left">
                    <i class="mdi material-icons">search</i>
                </span>
                <input class="input" type="search" v-model="searchQuery" placeholder="Search modules" />
            </div>
        </div>
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
                <tr>
                    <th><abbr>Name</abbr></th>
                    <th><abbr>Type</abbr></th>
                    <th></th>
                </tr>
            </thead>
            <tbody v-for="(module, index) in filteredModules" :key="index">
                <tr :class="hasNestedModules(module) ? 'has-background-white-ter' : ''">
                    <td>
                        <div class="flex click">
                            <span v-if="hasNestedModules(module)" @click="toggleNested(module)">
                                <i class="mdi material-icons">
                                    {{ isNestedExpanded(module) ? 'keyboard_arrow_down' : 'keyboard_arrow_right' }}
                                </i>
                            </span>
                            {{ module.name }}
                        </div>
                    </td>
                    <td>
                        <div class="badge">
                            <span class="mdi material-icons">{{ getModuleTypeClass(module.type) }}</span>
                            {{ module.type }}
                        </div>
                    </td>
                    <td>
                        <button class="button" @click="showModuleDetails(module)">
                            <span class="icon">
                                <i class="material-icons">list</i>
                            </span>
                        </button>
                    </td>
                </tr>
                <tr v-if="hasNestedModules(module) && isNestedExpanded(module)" class="has-background-light">
                    <td colspan=" 3">
                        <recipe-modules :recipe="module" :moduleDetails="moduleDetails"
                            @showModuleDetails="showModuleDetails" @closeModuleDetails="goBack"></recipe-modules>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="filteredModules.length === 0">
            <td colspan="3">No modules found.</td>
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
            <h3 class="title is-3">{{ moduleDetails.name }}</h3>
            <p class="subtitle is-4">Module of type
                <span class="badge">
                    <span class="mdi material-icons">{{ getModuleTypeClass(moduleDetails.type) }}</span>
                    <span>{{ moduleDetails.type }}</span>
                </span>
            </p>
        </div>

        <div class="block">
            <h4 class="title is-4">Snippet</h4>
            <pre class="block">{{ moduleDetails.snippet }}</pre>
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
                    <pre class="block">{{ value }}</pre>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import atlasHelpers from "@/core/helpers";
import type { Module } from "@/core/models";

export default {
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
        };
    },
    computed: {
        filteredModules() {
            const query = this.searchQuery.toLowerCase().trim();
            if (!query) {
                return this.recipe.modules;
            }
            return this.recipe.modules.filter(
                (module: Module) =>
                    module.name.toLowerCase().includes(query) || module.type.toLowerCase().includes(query)
            );
        },
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

    },
};
</script>