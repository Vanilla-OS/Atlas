import { defineStore } from 'pinia';
import type { VibRecipe } from '@/core/models';

export const useAtlasStore = defineStore('atlas', {
    state: () => ({
        vibRecipes: [] as VibRecipe[],
        lastFetchDate: Date.now(),
    }),
    persist: {
        storage: window.localStorage,
    },
});
