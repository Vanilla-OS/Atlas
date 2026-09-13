# Atlas

Atlas is OCI registry, designed for Vanilla OS.

## Configuration

To configure your registry, you need to edit the `config.ts` file.

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

## Use of Generative AI

Maintainers may use generative AI tools as assistants while working on Atlas. Non-trivial assisted commits disclose the tool, model, and scope of the work.

AI tools may assist with code comments, documentation, repetitive code, and issue triage. Maintainers make project decisions and review every assisted change before it is merged.

Use these trailers for non-trivial assisted commits:

```plain
Assisted-by: <tool>:<model-version>
AI-Scope: <what the tool generated and the prompt or a short prompt summary>
```

Single-line completions, renames, and formatting changes do not need trailers.

Coding agents must also follow [AGENTS.md](AGENTS.md) before changing files,
creating commits, or opening pull requests.
