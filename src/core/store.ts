import { defineStore } from 'pinia';
import type { VibRecipe } from '@/core/models';

export const useAtlasStore = defineStore('atlas', {
    state: () => ({
        vibRecipes: [] as VibRecipe[],
        lastFetchDate: Date.now(),
        layout: 'grid',
    }),
    persist: {
        storage: window.localStorage,
    },
    actions: {
        getVibRecipe(id: string): Promise<VibRecipe | null> {
            const recipe = this.vibRecipes.find((r) => r.id === id);
            return recipe ? Promise.resolve(recipe) : Promise.reject(null);
        }
    },
});
