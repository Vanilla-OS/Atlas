<template>
    <ul>
        <li v-for="(value, index) in recipe.runs" :key="index">
            <pre class="block" v-highlight:bash><code>{{ value }}</code></pre>
        </li>
    </ul>
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
