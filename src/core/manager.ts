import axios from "axios";
import * as yaml from "js-yaml";
import type { VibRecipe, Module } from "@/core/models";
import AtlasConfig from "@/config";
import { useAtlasStore } from '@/core/store';

class AtlasManager {
  private static readonly storageKey = "vibRecipes";

  private static async fetchRecipeFromRepo(
    repo: string
  ): Promise<string | null> {
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
  }

  private static async fetchModuleContentFromRepo(
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
  }

  private static getFromLocalStorage(): VibRecipe[] | null {
    const store = useAtlasStore();
    return store.getVibRecipes;
  }

  private static saveToLocalStorage(recipes: VibRecipe[]): void {
    const store = useAtlasStore();
    store.setVibRecipes(recipes);
  }

  public static async getVibRecipes(force: boolean = false): Promise<VibRecipe[]> {
    console.log("Fetching VibRecipes...");

    if (!force) {
      const cachedRecipes = this.getFromLocalStorage();
      const lastFetchDate = localStorage.getItem("lastFetchDate");

      if (cachedRecipes !== null && cachedRecipes.length > 0 && lastFetchDate) {
        console.log("Using cached VibRecipes.");
        return cachedRecipes;
      }
    }

    const vibRecipes: VibRecipe[] = [];

    try {
      const fetchPromises = AtlasConfig.repos.map(async (repo) => {
        console.log(`Fetching recipe.yml from ${repo}`);
        const recipeYaml = await this.fetchRecipeFromRepo(repo);
        if (recipeYaml !== null) {
          console.log(`Parsing recipe.yml from ${repo}`);
          const recipeObject = yaml.load(recipeYaml) as VibRecipe;
          recipeObject.snippet = recipeYaml;
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
                      const includedModule = yaml.load(moduleContent) as Module;
                      includedModule.snippet = moduleContent;
                      modules.push(includedModule);
                    } catch (error) {
                      console.error(
                        `Error parsing included module from ${repo}: ${(error as Error).message
                        }`
                      );
                    }
                  }
                }
              } else {
                module.snippet = yaml.dump(module);
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
      console.error(`Error fetching or parsing recipes: ${(error as Error).message}`);
    }

    this.saveToLocalStorage(vibRecipes);

    console.log("Finished fetching VibRecipes");
    return vibRecipes;
  }

  public static async getVibRecipe(id: string): Promise<VibRecipe | null> {
    const vibRecipes = await this.getVibRecipes();
    for (const recipe of vibRecipes) {
      if (recipe.id === id) {
        return recipe;
      }
    }
    return null;
  }

  public static getFetchDate(): Date | null {
    const store = useAtlasStore();
    const lastFetchDate = store.getLastFetchDate;
    if (lastFetchDate) {
      return new Date(lastFetchDate);
    }
    return null;
  }
}

export default AtlasManager;
