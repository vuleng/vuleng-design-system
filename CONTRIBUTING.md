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
| Detailed Next.js patterns | `engineering/nextjs.md` (overview), `engineering/nextjs-auth.md` (auth), `engineering/nextjs-data.md` (data + actions), `engineering/nextjs-forms.md` (forms / modals / search) |
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

Files over ~400 lines should be split. The Next.js playbook is now split across `nextjs.md` (overview), `nextjs-auth.md`, `nextjs-data.md`, and `nextjs-forms.md` — each within or near the cap. The rump `nextjs.md` runs slightly over (~520 lines) because the project-structure tree it leads with is high-value orientation; that's acceptable for an overview file dominated by code blocks.

## Example vs Pattern Convention

Every fenced code block in `design/`, `engineering/`, `fragments/`, and `ai/plugin/skills/*/SKILL.md` is annotated with an HTML comment immediately above it that tells AI tools (and humans) whether the block is illustrative or prescriptive. This stops AI from copying domain-specific examples literally into unrelated projects.

### The two markers

**`<!-- example: ... -->`** — illustrative code. The reader is expected to substitute domain-specific names (tables, routes, components, copy). Adapt structure freely.

```md
<!-- example: substitute your own domain -->
```ts
// illustrative code with placeholder names
```
```

**`<!-- pattern: ... -->`** — required structure. The shape, signatures, return types, or token names MUST be followed verbatim. Substitution is limited to the parts the comment specifies.

```md
<!-- pattern: required structure -->
```ts
// canonical pattern
```
```

### Heading prefix

Sections that consist primarily of demonstrative code (not required APIs) prefix the heading with `Example —`:

```md
## Example — Server action with Zod
```

This signal is reserved for sections where the heading itself could be misread as prescribing an API. Don't add it to sections that define required contracts.

### Decision rules

Use `<!-- pattern: -->` for:
- Server-action return-shape `{ ok: true, data } | { ok: false, error }`
- Auth middleware structure (must call `getClaims()`, not `getUser()`)
- View-as-role contract (`getEffectiveRole()` server, `useViewAsRole()` client)
- RLS policy structure (specific clause ordering)
- Theme override structure (which CSS vars must be defined)
- Standard requirements scaffolding (i18n, dark mode, testing setup)
- Dark-mode toggle / boot script
- Canonical install / import commands and required env var names
- Auth helper signatures (`requireRole`, `requireAdmin`, `getCurrentUserWithProfile`)

Use `<!-- example: -->` for:
- Anything with a domain-specific table, route, or component name
- Demonstrative code where the user will substitute their own data
- Specific UI snippets (button HTML, card layouts) where the user will adapt structure
- SQL queries against named tables
- Specific i18n keys
- Project-layout trees from a real Vulkan app

**When in doubt, prefer `<!-- example: -->`.** A misclassified pattern locks readers into a shape that wasn't actually required; a misclassified example just gives them more freedom than necessary.

### Why

The Claude Code plugin in `ai/plugin/` loads these docs as context for AI assistants. Without these markers, AI tools sometimes treat domain-specific examples (climbing-app tables, specific route names) as prescriptive patterns and copy them literally into unrelated projects. The markers give AI a clear signal about which parts to generalize and which to follow verbatim.

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

- ~~Splitting `engineering/nextjs.md` into auth + data sub-files (v2.x).~~ Done — see CHANGELOG [Unreleased].
- Optional density theme axis (resist unless real client ask).
- Auto-generating perceptual color ramps from a brand color (v2.x).
- React component shipping (only if 3+ Vulkan apps emerge).
- Extracting `engineering/` into a sibling repo (only if it grows past ~15 files or release cadence diverges).
