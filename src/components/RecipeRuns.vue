<template>
    <div v-for="(stage, index) in recipe.stages" :key="index">
        <h2 class="text-lg font-bold mt-4 mb-2">Stage "{{ stage.id }}"</h2>
        <ul>
            <li v-for="(value, index) in stage.runs" :key="index">
                <pre class="block p-4 bg-gray-100 rounded-md overflow-x-auto"><code>{{ value }}</code></pre>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        recipe: {
            type: Object,
            required: true,
        },
    },
};
</script>
