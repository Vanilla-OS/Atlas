<template>
    <div v-for="(stage, index) in recipe.stages" :key="index">
        <h2 class="title is-4">Stage "{{ stage.id }}"</h2>
        <ul>
            <li v-for="(value, index) in stage.runs" :key="index">
                <pre class="block" v-highlight:bash><code>{{ value }}</code></pre>
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
