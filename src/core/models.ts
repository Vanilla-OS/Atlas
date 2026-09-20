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
  label: string;
  git_branch: string;
  image: string;
  id: string;
  outdated?: boolean;
  verified: boolean;
  de?: string;
  hardware?: string;
  category?: string;
  stages: Stage[];
}

interface RepoInfo {
  pretty_name?: string;
  pretty_id?: string;
  git: string;
  image: string;
  verified: boolean;
  outdated?: boolean;
  de?: string;
  hardware?: string;
}

interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  title: string;
  subtitle?: string;
}

export type { VibRecipe, Module, Source, Stage, RepoInfo, CategoryInfo };