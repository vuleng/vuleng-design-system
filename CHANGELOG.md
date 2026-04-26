# Changelog

All notable changes to `@vuleng/design-system` (formerly `@vuleng/tailwind-preset`) are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/), versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Changed
- Generified `engineering/supabase.md` examples (orders/products/categories/vendors instead of climbing-app domain) so AI context doesn't leak unrelated terminology into other Vulkan projects.
- Split `engineering/nextjs.md` (1471 lines) into focused files: `nextjs.md` (overview / project structure / server vs client / loading / file naming / i18n / error boundaries / Supabase client cheat sheet), `nextjs-auth.md` (middleware, `getCurrentUserWithProfile`, `requireRole` helpers), `nextjs-data.md` (server-component fetches, parallel queries, `unstable_cache`, server actions), and `nextjs-forms.md` (Zod forms, modals, Cmd+K search). Concrete RTL/Zod test examples moved into `testing.md`. AI plugins (`vulkan-stack` skill) now load only the per-topic file relevant to the user's question, saving context window space. Removes the v2.x split debt noted in v2.0.0.
- Apply `<!-- example: -->` and `<!-- pattern: -->` markers to all docs so AI tools distinguish illustrative examples from required patterns. See CONTRIBUTING.md for the convention.
- Apply example/pattern markers to the four files that came out of the `engineering/nextjs.md` split (`nextjs.md` rump, `nextjs-auth.md`, `nextjs-data.md`, `nextjs-forms.md`) plus the new test sections in `testing.md`. Completes the marker pass; every fenced code block in the design system docs is now classified.

---

## [2.0.0] — 2026-04-25

Major overhaul. Multi-theme support, Tailwind v4 native, AI-first documentation, Claude Code plugin replaces copy-paste AI rule files.

### Breaking Changes

- **Tailwind v4 only.** v3 is no longer supported. `peerDependencies` now requires `tailwindcss: ^4.0.0`.
- **Package renamed.** `@vuleng/tailwind-preset` → `@vuleng/design-system`. Existing apps must update the dependency name in `package.json` (the install URL `github:vuleng/vuleng-design-system` is unchanged).
- **CSS-first distribution.** v1's `presets: [require("@vuleng/tailwind-preset")]` JS pattern no longer works. v2 is consumed via CSS:
  ```css
  @import "@vuleng/design-system";
  ```
  `tailwind.config.js` / `tailwind.config.ts` files should be removed.
- **AI rule files removed.** `ai/CLAUDE.md` and `ai/copilot-instructions.md` are gone. Replaced by the Claude Code plugin at `ai/plugin/`. Copilot/Cursor users should read the markdown docs in `design/` and `engineering/` directly — no auto-loaded rule file is generated.
- **`DESIGN.md` removed.** The single-file consolidated spec is replaced by the folder structure (`design/`, `engineering/`, `ai/`) plus the SSOT `fragments/` library.

### Added

- **Multi-theme architecture.** Themes are CSS files under `themes/` that override CSS variables. Default `themes/vulkan.css` ships Vulkan branding; `themes/example-acme.css` is a proof-of-concept client theme. Authoring guide in [`design/theming.md`](design/theming.md).
- **Tailwind v4 preset (`preset.css`).** Brand-agnostic core with `@theme` blocks for neutral tokens (radii, font, leading, shadows), `@custom-variant dark (...)` for class-based dark mode, and `@layer components` for soft-glass UI classes.
- **Theme-overridable axes:** brand colors (primary + accent + variants), font family (`--font-sans`), component radii (`--radius-button`, `--radius-card`, `--radius-input`), and shadow tint (`--color-shadow-rgb`).
- **Folder-grouped docs:**
  - `design/` — overview, brand, colors, typography, components, dark-mode, motion, responsive, accessibility, theming
  - `engineering/` — overview, stack-guide, nextjs, supabase, performance, deploy, project-template, documentation, testing (NEW), troubleshooting (NEW), astro-sanity (NEW, draft)
  - `fragments/` — single source of truth for color tokens, neutral mapping, component classes, anti-patterns, standard requirements, Next.js essentials
- **Claude Code plugin (`ai/plugin/`).** Three lazy-loaded skills:
  - `vulkan-ui` — design rules for UI work
  - `vulkan-stack` — full-stack patterns (Next.js, Supabase, performance, deploy, testing)
  - `vulkan-bootstrap` — scaffold a new Vulkan project
- **Fragment include processor.** `scripts/build-fragments.mjs` resolves `<!-- include: fragments/foo.md -->` markers at release time, producing a self-contained `dist/` tree.
- **`MIGRATION.md`** — step-by-step v1 → v2 upgrade guide.
- **`CONTRIBUTING.md`** — how to change this repo.
- **AI-friendly markdown conventions:** YAML frontmatter (`audience`, `scope`, `stability`, `last-verified`), 5-line "what / when / not" headers, stable greppable headings, anti-patterns blocks, soft 400-line cap per file.

### Changed

- **Component classes use CSS variables.** Every hardcoded hex/rgba in v1's `.btn-primary`, `.card`, `.input-field`, etc. is now a `var(--color-*)` reference. Default Vulkan theme produces visually identical output to v1.2.0.
- **`.btn-navy` → `.btn-accent`** with `.btn-navy` retained as a legacy alias. Prefer `.btn-accent` in new code.
- **`vulkan-*` Tailwind tokens preserved as legacy aliases.** `bg-vulkan-orange`, `text-vulkan-navy`, `bg-vulkan-bg`, `text-vulkan-gray`, `text-vulkan-black` continue to work for v1.x-style code. New code should prefer semantic tokens (`brand-primary`, `brand-accent`, etc.).
- **Vulkan-only ramps (`orange-{50–950}`, `navy-{50–950}`, `dark-*`) flagged.** They still emit utilities under the Vulkan theme, but white-label code must avoid them — they don't follow client themes. See `fragments/anti-patterns.md`.
- **Shadow tint themable.** `--color-shadow-rgb` defaults to navy in Vulkan, can be overridden by client themes (warm gray for Acme example, etc.).

### Deprecated

- `@vuleng/tailwind-preset` package name (use `@vuleng/design-system`).
- `.btn-navy` class name (use `.btn-accent`).
- Vulkan-only ramps in white-label code.

### Removed

- `preset.js` (replaced by `preset.css` + theme files).
- `tailwind.config.ts`-style consumption pattern.
- `ai/CLAUDE.md` and `ai/copilot-instructions.md` (replaced by Claude Code plugin).
- `DESIGN.md` consolidated single-file spec (replaced by folder structure).
- Dependency on Tailwind v3 plugin API.

### Notes

- Default-theme parity: an app that bumps from v1.2.0 → v2.0.0 with no code changes (other than the CSS import line) should look pixel-identical.
- The plan for v2.x: split `engineering/nextjs.md` (currently 1471 lines) into auth/data sub-files _(done in [Unreleased])_, add Storybook if a second designer joins, evaluate React component shipping if 3+ Vulkan apps emerge.

---

## [1.2.0] — 2026-04-17

- Added full-stack architecture guides (NEXTJS, SUPABASE, PERFORMANCE, DEPLOY, STACK-GUIDE, PROJECT-TEMPLATE, DOCUMENTATION).

## [1.1.0] — 2026-03-13

- Neutral palette, glass cards, skeleton loaders, WCAG buttons, AI instructions.

## [1.0.0] — 2026-03-12

- Initial release. Tailwind v3 preset with Vulkan branding.
