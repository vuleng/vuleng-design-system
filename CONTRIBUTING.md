# Contributing to `@vuleng/design-system`

This repo is the source of truth for Vulkan Engineering's visual + engineering standards. Changes here ripple to every consuming app.

## Repo Layout

```
vuleng-design-system/
├── README.md, CHANGELOG.md, MIGRATION.md, CONTRIBUTING.md
├── package.json
├── index.css                # default entry: preset.css + themes/vulkan.css
├── preset.css               # core: variants, components, neutral tokens (theme-agnostic)
├── themes/
│   ├── vulkan.css           # Vulkan brand theme (default)
│   └── example-acme.css     # client-theme proof of concept
├── design/                  # design pillar — colors, components, dark mode, etc.
├── engineering/             # engineering pillar — Next, Supabase, deploy, etc.
├── fragments/               # SSOT snippets included into design/ + engineering/ + ai/
├── ai/
│   ├── README.md
│   └── plugin/              # Claude Code plugin
└── scripts/
    └── build-fragments.mjs  # resolves fragment includes for dist/
```

## Where Things Live

| Change type | File(s) to edit |
|-------------|----------------|
| Brand color tokens (Vulkan default) | `themes/vulkan.css` AND `fragments/colors-tokens.md` |
| Adding a new theme (client) | `themes/<name>.css` + add `exports` entry in `package.json` |
| Component CSS class definitions | `preset.css` |
| Component class API reference | `fragments/component-classes.md` (single source of truth) |
| Anti-pattern rules | `fragments/anti-patterns.md` |
| Standard requirements (i18n, dark mode, testing) | `fragments/standard-requirements.md` |
| Light↔dark color mapping | `fragments/neutral-mapping.md` |
| Next.js quick-reference for AI | `fragments/nextjs-essentials.md` |
| Detailed Next.js patterns | `engineering/nextjs.md` |
| Detailed design rules | `design/<topic>.md` |
| AI plugin behavior | `ai/plugin/skills/<skill>/SKILL.md` |
| Anything human-facing | Update `CHANGELOG.md` |

**Do NOT** edit color tokens or component specs in multiple files. The `fragments/` library is the single source of truth — `design/colors.md`, plugin skills, and any other reference must `<!-- include: fragments/colors-tokens.md -->` (or just link to it for files that don't run through the include processor).

## File Conventions

### Frontmatter

Every markdown file in `design/`, `engineering/`, `ai/`, and `fragments/` has YAML frontmatter:

```md
---
file: design/colors.md
audience: [human, ai]
scope: design
stability: stable          # stable | draft | deprecated
last-verified: 2026-04-25
---
```

`audience` declares whether the file is meant for humans, AI tools, or both. `scope` declares which pillar it belongs to. `stability` flags content quality. `last-verified` is the last date the content was checked against reality — bump this whenever you re-read and confirm.

### Header block

Every md file leads with a 5-line summary:

```md
# Title

> **What this is:** One sentence.
> **When to read it:** One sentence.
> **What it doesn't cover:** One sentence pointing at the right neighbor.
```

This block is what AI tools read first. Keep it tight.

### Headings

Use stable, greppable headings. AI tools grep for `## Colors`, not for `## Our Color Story`. Resist creative naming.

### Tables for spec data

Anything with structured fields (token tables, button variants, prop lists, breakpoints) goes in a markdown table. Tables tokenize predictably and survive truncation.

### Anti-patterns block

Every design file ends with an `## Anti-Patterns` section listing things to NOT do. AI plugins lean on these heavily.

### Soft 400-line cap

Files over ~400 lines should be split. Exception: `engineering/nextjs.md` (1471 lines) — split into auth/data sub-files is on the v2.x roadmap.

## Theme-Adding Workflow

To add a new client theme `contoso`:

1. Copy `themes/example-acme.css` → `themes/contoso.css`.
2. Replace every value per the [theming guide](design/theming.md).
3. Add to `package.json` exports:
   ```json
   "./themes/contoso": "./themes/contoso.css"
   ```
4. Validate by importing in a sandbox app:
   ```css
   @import "@vuleng/design-system/preset";
   @import "@vuleng/design-system/themes/contoso";
   ```
5. Test light + dark mode, every component variant, all interactive states.
6. Run the validation checklist from `design/theming.md`.
7. PR with screenshots in light + dark.

## Fragment-Including Workflow

When a section of content needs to live in two places (e.g. anti-patterns shared between `design/colors.md` and the `vulkan-ui` skill):

1. Put the canonical text in a new `fragments/<name>.md`.
2. In the consuming files, replace the duplicated section with:
   ```md
   <!-- include: fragments/<name>.md -->
   ```
3. To produce a self-contained `dist/` (e.g. for npm publishing), run:
   ```bash
   node scripts/build-fragments.mjs
   ```
4. CI should run `node scripts/build-fragments.mjs --check` to flag any broken markers before release.

## Release Process

1. Open PR with changes + bumped `version` in `package.json` + new `CHANGELOG.md` entry.
2. After merge: `git tag v2.x.y && git push --tags`.
3. Notify consuming app maintainers (currently: climbing-app testbench, plus any Vulkan apps that pin this preset).
4. For breaking changes: also update `MIGRATION.md` with the upgrade path.

Use [SemVer](https://semver.org/):
- **Major** — breaking changes to tokens, class names, file paths, or distribution format.
- **Minor** — new tokens, new component classes, new themes, new docs.
- **Patch** — bug fixes, doc clarifications, internal refactors.

## What Belongs Here vs. an App

This repo is for **shared** Vulkan standards. App-specific concerns belong in the app's own repo.

| Belongs here | Belongs in the app |
|--------------|--------------------|
| Brand colors, fonts, radii | App-only colors, custom fonts |
| Component CSS (`.btn-primary`) | Shared UI components (e.g. `<RouteCard>`) |
| Engineering patterns (auth, RLS, server actions) | App's specific routes, schemas, business rules |
| AI rules for any Vulkan project | App's project-specific `CLAUDE.md` |
| Standard requirements (i18n, dark mode, testing) | App's own translation keys, theme picker UI |

When in doubt: if 2+ Vulkan apps would benefit, it goes here. If only one app needs it, keep it in that app.

## Future Considerations

Tracked in `CHANGELOG.md` under "Notes" for the active major version:

- Splitting `engineering/nextjs.md` into auth + data sub-files (v2.x).
- Optional density theme axis (resist unless real client ask).
- Auto-generating perceptual color ramps from a brand color (v2.x).
- React component shipping (only if 3+ Vulkan apps emerge).
- Extracting `engineering/` into a sibling repo (only if it grows past ~15 files or release cadence diverges).
