# CLAUDE.md

**@davidalmeida/ui** — React 19 + Tailwind 4 components that the CLI copies into the user's project (shadcn model). Public on npm and GitHub.

- Source of truth: `src/components` (pieces) and `src/styles` (`tokens.css` + `theme.css`). `npm run build` generates `registry/` and `tailwind.css` (not in git).
- Everything here is in English: names, props, files, comments. Visible texts default to pt-BR and are exposed as props.
- A piece imports only from `./…` and from packages listed in `devDependencies` (the build fails otherwise; the version there is what `add` installs).
- `npm run check` before committing. To release: bump `version`, `npm publish` in a real terminal (passkey), then approve the staged version.
- Consumers (e.g. niwiaBuilder) update their copy with `npx @davidalmeida/ui add <name> --overwrite`; `diff` shows drift.
