import type { App } from "vue";
import axios from "axios";
import * as yaml from "js-yaml";
import type { VibRecipe, Module } from "@/core/models";
import AtlasConfig from "@/config";
import { useAtlasStore } from "@/core/store";


export interface IAtlasManager {
  getVibRecipes(force: boolean): Promise<VibRecipe[]>;
  getVibRecipe(id: string): Promise<VibRecipe | null>;
  getFetchDate(): Promise<Date | null>;
  fetchRecipeFromRepo(repo: string, branch: string): Promise<string | null>;
  fetchModuleContentFromRepo(
    repo: string,
    path: string,
    branch: string
  ): Promise<string | null>;
}

export default {
  install: (app: App) => {
    const store = useAtlasStore();

    app.config.globalProperties.$atlasManager = {
      async getVibRecipes(force: boolean = false): Promise<VibRecipe[]> {
        console.log("Fetching VibRecipes...");

        if (!force) {
          console.log("Checking for cached VibRecipes...");
          const cachedRecipes = store.vibRecipes;
          const lastFetchDate = store.lastFetchDate;

          if (cachedRecipes.length > 0 && lastFetchDate) {
            console.log("Using cached VibRecipes.");
            return cachedRecipes;
          }
        } else {
          console.log("Forcing fetch of VibRecipes...");
        }

        const vibRecipes: VibRecipe[] = [];

        try {
          const fetchPromises = AtlasConfig.repos.map(async (repo) => {
            let branch = "main";
            const repoParts = repo.split(":");
            if (repoParts.length > 1) {
              repo = repoParts[0];
              branch = repoParts[1];
            }

            console.log(`Fetching recipe.yml from ${repo} using branch ${branch}`);
            const recipeYaml = await this.fetchRecipeFromRepo(repo, branch);
            if (recipeYaml !== null) {
              console.log(`Parsing recipe.yml from ${repo}`);
              const recipeData = yaml.load(recipeYaml) as VibRecipe;
              recipeData.repo = repo;
              // @ts-ignore
              recipeData.stages = await Promise.all(recipeData.stages.map(async stage => {
                const processedModules = stage.modules ? await Promise.all(stage.modules.map(async module => {
                  if (module.includes) {
                    console.log(`Fetching and processing included modules for ${repo}`);
                    return {
                      ...module,
                      modules: await Promise.all(module.includes.map(async includePath => {
                        const moduleContent = await this.fetchModuleContentFromRepo(repo, includePath, branch);
                        return moduleContent ? yaml.load(moduleContent) as Module : module;
                      }))
                    };
                  }
                  return module;
                })) : [];
                return { ...stage, modules: processedModules };
              }));
              vibRecipes.push(recipeData);
            }
          });

          await Promise.all(fetchPromises);
        } catch (error) {
          console.error(`Error fetching or parsing recipes: ${(error as Error).message}`);
        }

        store.$patch({ vibRecipes: vibRecipes });
        store.$patch({ lastFetchDate: Date.now() });

        console.log("Finished fetching VibRecipes");
        return vibRecipes;
      },

      async getVibRecipe(id: string): Promise<VibRecipe | null> {
        const vibRecipes = await this.getVibRecipes(false);
        return vibRecipes.find(recipe => recipe.id === id) || null;
      },

      async getFetchDate(): Promise<Date | null> {
        const lastFetchDate = store.lastFetchDate;
        if (lastFetchDate) {
          return new Date(lastFetchDate);
        }
        return null;
      },

      async fetchRecipeFromRepo(repo: string, branch: string = "main"): Promise<string | null> {
        const url = `${AtlasConfig.registry}/${repo}/${branch}/recipe.yml`;
        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.error(`Error fetching recipe.yml from ${repo}: ${(error as Error).message}`);
          return null;
        }
      },

      async fetchModuleContentFromRepo(repo: string, path: string, branch: string = "main"): Promise<string | null> {
        const url = `${AtlasConfig.registry}/${repo}/${branch}/${path}`;
        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.error(`Error fetching module content from ${url}: ${(error as Error).message}`);
          return null;
        }
      },
    } as IAtlasManager;

    console.log("AtlasManager: fetching VibRecipes...");
    app.config.globalProperties.$atlasManager.getVibRecipes(false);
    console.log("AtlasManager: done");

  },
};

// @ts-ignore
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $atlasManager: IAtlasManager;
  }
}
