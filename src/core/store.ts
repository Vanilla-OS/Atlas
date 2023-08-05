import { defineStore } from 'pinia';
import type { VibRecipe } from '@/core/models';

export const useAtlasStore = defineStore({
    id: 'atlas',
    state: () => ({
        vibRecipes: null as VibRecipe[] | null,
    }),
    getters: {
        getVibRecipes(): VibRecipe[] {
            if (this.vibRecipes) {
                return this.vibRecipes;
            }

            const vibRecipes = localStorage.getItem("vibRecipes");
            if (vibRecipes) {
                this.vibRecipes = JSON.parse(vibRecipes) as VibRecipe[];
                return this.vibRecipes;
            }

            return [];
        }
    },
    actions: {
        setVibRecipes(vibRecipes: VibRecipe[]) {
            this.vibRecipes = vibRecipes;
            localStorage.setItem("vibRecipes", JSON.stringify(vibRecipes));
        },
    },
});