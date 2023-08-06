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
  fetchRecipeFromRepo(repo: string): Promise<string | null>;
  fetchModuleContentFromRepo(
    repo: string,
    path: string
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
            console.log(`Fetching recipe.yml from ${repo}`);
            const recipeYaml = await this.fetchRecipeFromRepo(repo);
            if (recipeYaml !== null) {
              console.log(`Parsing recipe.yml from ${repo}`);
              const recipeObject = yaml.load(recipeYaml) as VibRecipe;
              const modules: Module[] = [];

              if (recipeObject.modules) {
                for (const module of recipeObject.modules) {
                  if (module.includes) {
                    console.log(
                      `Fetching and processing included modules for ${repo}`
                    );
                    for (const includePath of module.includes) {
                      const moduleContent = await this.fetchModuleContentFromRepo(
                        repo,
                        includePath
                      );
                      if (moduleContent) {
                        try {
                          const includedModule = yaml.load(
                            moduleContent
                          ) as Module;
                          modules.push(includedModule);
                        } catch (error) {
                          console.error(
                            `Error parsing included module from ${repo}: ${(error as Error).message}`
                          );
                        }
                      }
                    }
                  } else {
                    modules.push(module);
                  }
                }
              }

              recipeObject.id = repo.replace("/", "-");
              recipeObject.modules = modules;
              vibRecipes.push(recipeObject);
            }
          });

          await Promise.all(fetchPromises);
        } catch (error) {
          console.error(
            `Error fetching or parsing recipes: ${(error as Error).message}`
          );
        }

        store.$patch({ vibRecipes: vibRecipes });
        store.$patch({ lastFetchDate: Date.now() });

        console.log("Finished fetching VibRecipes");
        return vibRecipes;
      },

      async getVibRecipe(id: string): Promise<VibRecipe | null> {
        const vibRecipes = await this.getVibRecipes(false);
        for (const recipe of vibRecipes) {
          if (recipe.id === id) {
            return recipe;
          }
        }
        return null;
      },

      async getFetchDate(): Promise<Date | null> {
        const lastFetchDate = store.lastFetchDate;
        if (lastFetchDate) {
          return new Date(lastFetchDate);
        }
        return null;
      },

      async fetchRecipeFromRepo(repo: string): Promise<string | null> {
        const url = `${AtlasConfig.registry}/${repo}/main/recipe.yml`;
        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.error(
            `Error fetching recipe.yml from ${repo}: ${(error as Error).message}`
          );
          return null;
        }
      },

      async fetchModuleContentFromRepo(
        repo: string,
        path: string
      ): Promise<string | null> {
        const url = `${AtlasConfig.registry}/${repo}/main/${path}.yml`;
        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.error(
            `Error fetching module content from ${url}: ${(error as Error).message}`
          );
          return null;
        }
      },
    } as IAtlasManager;

    console.log("AtlasManager: fetching VibRecipes...");
    app.config.globalProperties.$atlasManager.getVibRecipes(false);
    console.log("AtlasManager: done");

  },
};

declare module "@vue/runtime-core" {
  //Bind to `this` keyword
  interface IAtlasManager {
    $atlasManager: IAtlasManager;
  }
}
