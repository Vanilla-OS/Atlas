class AtlasConfig {
  public static readonly publicUrl = "https://images.vanillaos.org";
  public static readonly registry = "https://raw.githubusercontent.com";
  public static readonly publicRegistry = "https://github.com";
  public static readonly title = "Vanilla OS Registry";
  public static readonly pullRegistry = "ghcr.io/vanilla-os";
  public static readonly pullBranch = "main";
  public static readonly repos = [
    "vanilla-os/pico-image",
    "vanilla-os/core-image",
    "vanilla-os/dev-image",
    "vanilla-os/vso-image",
    "vanilla-os/desktop-image",
    "vanilla-os/nvidia-image",
    "vanilla-os/waydroid-image",
    "vanilla-os/vm-image",
    "vanilla-os/custom-image",
    "vanilla-os/chronos",
    "vanilla-os/chronos-frontend",
    "vanilla-os/website:v2",
    "vanilla-os/differ",
  ];
}

export default AtlasConfig;
