<template>
    <div v-if="!moduleDetails">
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
                <tr>
                    <th><abbr>Name</abbr></th>
                    <th><abbr>Type</abbr></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(module, index) in recipe.modules" :key="index">
                    <td>{{ module.name }}</td>
                    <td>{{ module.type }}</td>
                    <td>
                        <button class="button" @click="showModuleDetails(module)">
                            <span class="icon">
                                <i class="material-icons">list</i>
                            </span>
                        </button>
                    </td>
                </tr>
                <tr v-if="!recipe.modules.length">
                    <td colspan="3">No modules found.</td>
                </tr>
            </tbody>
        </table>
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
            <p class="subtitle is-4">Module of type <u>{{ moduleDetails.type }}</u></p>
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
    methods: {
        showModuleDetails(module: any) {
            this.$emit("showModuleDetails", module);
        },
        goBack() {
            this.$emit("closeModuleDetails");
        },
    },
};
</script>
