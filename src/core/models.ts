interface Source {
  packages?: string;
  path?: string;
  url?: string;
  type?: string;
  tag?: string;
  commit?: string;
}

interface Module {
  name: string;
  type: string;
  path?: string;
  source?: Source;
  buildflags?: string[];
  buildvars?: string[];
  modules?: { [key: string]: Module };
  includes?: string[];
  commands?: string[];
}

interface Stage {
  id: string;
  recipeObject: any;
  base: string;
  singlelayer: boolean;
  labels: { [key: string]: string };
  args: { [key: string]: string };
  runs: string[];
  modules: Module[];
}

interface VibRecipe {
  name: string;
  repo: string;
  id: string;
  stages: Stage[];
}

export type { VibRecipe, Module, Source, Stage };