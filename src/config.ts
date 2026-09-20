class AtlasConfig {
  public static readonly registry = "https://raw.githubusercontent.com";
  public static readonly publicRegistry = "https://github.com";
  public static readonly title = "Vanilla OS Registry";

  public static readonly categories: ReadonlyArray<CategoryInfo> = [
    {
      id: "vanilla-images",
      label: "Vanilla Images",
      icon: "apps",
      title: "Vanilla OS Image Marketplace",
      subtitle: "Browse the images published in the Vanilla OS registry.",
    },
    {
      id: "vib-recipes",
      label: "Vib Recipes",
      icon: "receipt_long",
      title: "Vib Recipes",
      subtitle: "Browse the recipes used to build Vanilla OS images.",
    },
  ];

  public static readonly imageRepos: ReadonlyArray<RepoInfo> = [
    { git: "vanilla-os/desktop-image", image: "ghcr.io/vanilla-os/gnome", verified: true, de: "GNOME", hardware: "Generic" },
    { git: "vanilla-os/nvidia-image", image: "ghcr.io/vanilla-os/gnome-nvidia", verified: true, de: "GNOME", hardware: "NVIDIA" },
    { git: "vanilla-os/nvidia-exp-image", image: "ghcr.io/vanilla-os/gnome-nvidia-modern", verified: true, de: "GNOME", hardware: "NVIDIA" },
    { git: "vanilla-os/vm-image", image: "ghcr.io/vanilla-os/gnome-vm", verified: true, de: "GNOME", hardware: "VM" },

    { git: "vanilla-flavors/china-image:dev", image: "ghcr.io/vanilla-flavors/gnome-china", verified: true, de: "GNOME", hardware: "Generic" },

    { git: "vanilla-kattleya/plasma-image", image: "ghcr.io/vanilla-kattleya/plasma:main", outdated: true, verified: false, de: "KDE Plasma", hardware: "Generic" },
    { pretty_name: "Kattleya Plasma Desktop Nvidia", pretty_id: "kattleya-nvidia", git: "vanilla-kattleya/nvidia-image:main", image: "ghcr.io/vanilla-kattleya/nvidia", outdated: true, verified: false, de: "KDE Plasma", hardware: "NVIDIA" },
    { pretty_name: "Kattleya Plasma Desktop VM", pretty_id: "kattleya-vm", git: "vanilla-kattleya/vm-image:main", image: "ghcr.io/vanilla-kattleya/vm", outdated: true, verified: false, de: "KDE Plasma", hardware: "VM" },

    { git: "kanola-images/kanola", image: "ghcr.io/kanola-images/plasma:main", outdated: true, verified: false, de: "KDE Plasma", hardware: "Generic" },
    { git: "kanola-images/kanola-nvidia", image: "ghcr.io/kanola-images/nplasma:main", outdated: true, verified: false, de: "KDE Plasma", hardware: "NVIDIA" },
    { git: "kanola-images/kanola-virt", image: "ghcr.io/kanola-images/vplasma:main", outdated: true, verified: false, de: "KDE Plasma", hardware: "VM" },

    { git: "kanola-images/hoisin:dev", image: "ghcr.io/kanola-images/hyprland:dev", outdated: true, verified: false, de: "Hyprland", hardware: "Generic" },

    { git: "planifolia-images/desktop-image", pretty_id: "planifolia-desktop", image: "ghcr.io/planifolia-images/desktop:main", outdated: true, verified: false, de: "GNOME", hardware: "Generic" },

    { pretty_name: "Vanilla Kipferl Desktop", git: "vanilla-kde/desktop-image:dev", image: "ghcr.io/vanilla-kde/kde:dev", verified: false, de: "KDE Plasma", hardware: "Generic" },

  ]

  public static readonly recipeRepos: ReadonlyArray<RepoInfo> = [
    { git: "vanilla-os/website", image: "ghcr.io/vanilla-os/website:v2", verified: true },
    { git: "vanilla-os/chronos-frontend", image: "vanilla-os/chronos-fe:main", verified: true },
    { git: "vanilla-os/differ", image: "ghcr.io/vanilla-os/differ:main", verified: true },
    { git: "vanilla-os/aptutil-image", image: "ghcr.io/vanilla-os/aptutil:main", verified: true },
    { git: "vanilla-os/virt-image", image: "ghcr.io/vanilla-os/virt:main", verified: true },
    { git: "vanilla-os/chronos", image: "ghcr.io/vanilla-os/chronos:main", verified: true },
    { git: "vanilla-os/pico-image", image: "ghcr.io/vanilla-os/pico", verified: true },
    { git: "vanilla-os/core-image", image: "ghcr.io/vanilla-os/core", verified: true },
    { git: "vanilla-os/dev-image", image: "ghcr.io/vanilla-os/dev", verified: true },
    { git: "vanilla-os/installer-image", image: "ghcr.io/vanilla-os/installer", verified: true, outdated: true },
    { git: "vanilla-os/vso-image", image: "ghcr.io/vanilla-os/vso", verified: true },
    { git: "vanilla-os/custom-image", image: "ghcr.io/vanilla-os/custom:main", verified: true },
    { git: "vanilla-flavors/vso-china-image", image: "ghcr.io/vanilla-os/vso-china", verified: true },
  ]

  public static readonly sources: ReadonlyArray<{ category: string; repos: ReadonlyArray<RepoInfo> }> = [
    { category: "vanilla-images", repos: AtlasConfig.imageRepos },
    { category: "vib-recipes", repos: AtlasConfig.recipeRepos },
  ]

}

import type { RepoInfo } from '@/core/models';
import type { VibRecipe } from '@/core/models';
import type { CategoryInfo } from '@/core/models';
export default AtlasConfig;
