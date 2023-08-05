import { defineStore } from 'pinia';
import type { VibRecipe } from '@/core/models';

export const useAtlasStore = defineStore({
    id: 'atlas',
    state: () => ({
        vibRecipes: null as VibRecipe[] | null,
        lastFetchDate: null as string | null,
    }),
    getters: {
        getVibRecipes(): VibRecipe[] {
            if (this.vibRecipes) {
                return this.vibRecipes;
            }

            const vibRecipes = localStorage.getItem("vibRecipes");
            if (vibRecipes) {
                this.vibRecipes = JSON.parse(vibRecipes) as VibRecipe[];
                this.lastFetchDate = localStorage.getItem("lastFetchDate");
                return this.vibRecipes;
            }

            return [];
        },
        getLastFetchDate(): string | null {
            return this.lastFetchDate;
        },
    },
    actions: {
        setVibRecipes(vibRecipes: VibRecipe[]) {
            this.vibRecipes = vibRecipes;
            this.lastFetchDate = new Date().toISOString();
            localStorage.setItem("vibRecipes", JSON.stringify(vibRecipes));
            localStorage.setItem("lastFetchDate", this.lastFetchDate);
        },
    },
});
