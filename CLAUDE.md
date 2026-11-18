# CLAUDE.md

**@davidalmeida/ui** — React 19 + Tailwind 4 components that the CLI copies into the user's project (shadcn model). Public on npm and GitHub.

- Source of truth: `src/components` (pieces) and `src/styles` (`tokens.css` + `theme.css`). `npm run build` generates `registry/` and `tailwind.css` (not in git).
- Everything here is in English: names, props, files, comments. Visible texts default to pt-BR and are exposed as props.
- A piece imports only from `./…` and from packages listed in `devDependencies` (the build fails otherwise; the version there is what `add` installs).
- `npm run check` before committing (and `npm run build` in `site/`).
- **Every change to a piece ships in three places, in one go**:
  1. **Site** (`site/`, Vite): a new or changed piece also updates its page — entry in `site/src/docs/components.ts` (props, `add` names, files) and demos in `site/src/examples/`. The site imports the pieces from `../src/components`, so it always shows the code being released.
  2. **Git**: bump `version` in `package.json`, commit and push `main`. The push deploys the site on Vercel (project `davidalmeida-ui`, Root Directory `site`, https://davidalmeida-ui.vercel.app).
  3. **npm**: push the tag `v<version>`; GitHub Actions (`publish.yml`, npm trusted publishing) publishes it.
     Then check: `npm view @davidalmeida/ui version` and the Vercel deployment for that commit is `READY`.
- Changes only to the site (no piece touched) need no version bump: pushing `main` is enough.
- Consumers (e.g. niwiaBuilder) update their copy with `npx @davidalmeida/ui add <name> --overwrite`; `diff` shows drift.
