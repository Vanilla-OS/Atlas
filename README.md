# Atlas

Atlas is OCI registry, designed for Vanilla OS.

## Configuration

To configure your registry, you need to edit the `config.ts` file.

Here are parameters currently available:

- `git: string;`: Git repository the recipe is fetched from, in `owner/repo` form. A `:branch` suffix is supported (`owner/repo:dev`) and becomes the branch used to fetch `recipe.yml`; without it, `main` is used.
- `image: string;`: OCI image the recipe builds, without a tag. A `:tag` suffix is supported (`ghcr.io/vanilla-os/gnome:dev`) and becomes the default tag shown in the pull command; without it, `latest` is used.
- `verified: boolean;`: Whether Vanilla OS maintains or officially regulates the image. Shown next to the name: a green check when `true`, a yellow cross when `false`.
- `outdated?: boolean;`: *(Optional)* Marks the image as outdated and possibly broken. Shown as a red exclamation icon, and the image is hidden when "Hide outdated recipes" is enabled.
- `de?: string;`: *(Optional)* Desktop environment of the image (e.g. `GNOME`, `KDE Plasma`). Shown as a blue badge and offered as a filter option.
- `hardware?: string;`: *(Optional)* Hardware target of the image (e.g. `Generic`, `NVIDIA`, `VM`). Shown as a purple badge and offered as a filter option.
- `pretty_name?: string;`: *(Optional)* Display name overriding the `name` declared in `recipe.yml`.
- `pretty_id?: string;`: *(Optional)* Identifier overriding the `id` declared in `recipe.yml`. Used in the `/recipe/:id` route, so it must be unique.

## Development

To run the registry in development mode, run the following command:

```bash
pnpm dev
```

## Production

To run the registry in production mode, run the following command:

```bash
pnpm build
```
