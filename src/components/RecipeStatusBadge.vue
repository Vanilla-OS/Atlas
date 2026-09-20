<template>
  <div class="group relative inline-flex items-center cursor-help">

    <font-awesome-icon
      v-if="recipe.outdated"
      :icon="['fas', 'circle-exclamation']"
      :class="[sizeClass, 'text-red-500 dark:text-red-400 transition-transform duration-200 group-hover:scale-110']"
    />

    <font-awesome-icon
      v-else
      :icon="recipe.verified ? ['fas', 'circle-check'] : ['fas', 'circle-xmark']"
      :class="[
        sizeClass,
        recipe.verified
          ? 'text-green-500 dark:text-green-400'
          : 'text-yellow-500 dark:text-yellow-400',
        'transition-transform duration-200 group-hover:scale-110'
      ]"
    />

    <div
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5
             bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg
             opacity-0 invisible group-hover:opacity-100 group-hover:visible
             transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
    >
      {{ tooltipText }}
      <div
        class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RecipeStatusBadge",
  props: {
    recipe: {
      type: Object as () => { outdated?: boolean; verified?: boolean },
      required: true,
    },
    size: {
      type: String as () => "sm" | "lg",
      default: "lg",
    },
  },
  computed: {
    sizeClass(): string {
      return this.size === "sm" ? "text-lg" : "text-2xl";
    },
    tooltipText(): string {
      if (this.recipe.outdated) {
        return "This image is outdated and may not work correctly.";
      }
      return this.recipe.verified
        ? "This image is maintained or officially regulated by Vanilla OS."
        : "This recipe is not regulated by Vanilla OS.";
    },
  },
});
</script>