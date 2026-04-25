# @vuleng/design-system

The complete starting kit for Vulkan Engineering app development — Tailwind v4 preset, multi-theme architecture, full-stack engineering guides, and a Claude Code plugin for AI-driven development.

> Part of the [Vulkan Engineering Company OS](https://github.com/vuleng/vuleng-company-os). For organisational context (tone of voice, processes, identity), see that repo.

---

## Where do I start?

| Use case | Click path |
|----------|-----------|
| **Building a new Vulkan-branded app** | [`engineering/00-overview.md`](engineering/00-overview.md) → pick a stack → scaffold |
| **Looking up a design token or class** | [`design/00-overview.md`](design/00-overview.md) → [`colors.md`](design/colors.md) / [`components.md`](design/components.md) |
| **Delivering a client-branded app** | [`design/theming.md`](design/theming.md) — author a theme without forking |
| **Setting up AI-assisted dev** | [`ai/README.md`](ai/README.md) — install the plugin or read docs directly |
| **Upgrading from v1.x** | [`MIGRATION.md`](MIGRATION.md) |
| **Hitting a build or theme issue** | [`engineering/troubleshooting.md`](engineering/troubleshooting.md) |

---

## Install

```bash
npm install github:vuleng/vuleng-design-system#v2.0.0
```

Add to your project's main CSS file (e.g. `src/app/globals.css`):

```css
@import "@vuleng/design-system";
```

That's it. Vulkan branding, soft-glass components, dark mode, and Tailwind v4 utilities are all wired up.

For a client-branded app, see [`design/theming.md`](design/theming.md).

---

## What ships in v2.0

| Pillar | Where |
|--------|-------|
| **Tailwind v4 preset** | `preset.css` — neutral tokens, variants, component classes (theme-agnostic) |
| **Vulkan brand theme** | `themes/vulkan.css` — colors, font, radii, dark mode |
| **Example client theme** | `themes/example-acme.css` — proof of concept for white-label |
| **Design docs** | `design/` — colors, components, dark mode, motion, accessibility, responsive, brand, theming |
| **Engineering guides** | `engineering/` — Next.js, Supabase, performance, deploy, testing, project bootstrap, troubleshooting |
| **Single-source fragments** | `fragments/` — color tokens, anti-patterns, component API, requirements (used by docs + plugin) |
| **Claude Code plugin** | `ai/plugin/` — `vulkan-ui`, `vulkan-stack`, `vulkan-bootstrap` skills |
| **Build pipeline** | `scripts/build-fragments.mjs` — resolves `<!-- include: -->` markers at release |

---

## Key Concepts

**Soft-glass aesthetic.** Surfaces are semi-transparent with backdrop blur. Borders are thin and tinted. Shadows use the active theme's accent color at low alpha. Motion is functional, not decorative.

**Multi-theme.** Default Vulkan branding lives in `themes/vulkan.css`. Client themes override CSS variables for brand colors, font, radii, and shadow tint — no forking, no per-class overrides. Density, type scale, and motion stay locked.

**Tailwind v4 native.** All theming via `@theme` directives. No `tailwind.config.js`. Distribution via `@import` from a published CSS file.

**Lazy AI context.** The Claude Code plugin loads design docs only when relevant skills trigger — 6000+ lines of guidance never sit idle in context.

---

## Standard Application Requirements

Every Vulkan Engineering app must implement:

1. **i18n:** Norwegian (default) + English with `localStorage` persistence.
2. **Dark/light mode:** Class-based toggle with `localStorage` persistence.
3. **Living docs:** Focused `docs/` folder updated in same commit as code.
4. **Test discipline:** Vitest + RTL; tests updated in same commit as source.

See [`fragments/standard-requirements.md`](fragments/standard-requirements.md) for the canonical statement.

---

## Updating apps when this preset releases

1. Bump version: `git tag v2.x.y && git push --tags`
2. In each consuming app, update the pin in `package.json` and run `npm install`.
3. Read [`CHANGELOG.md`](CHANGELOG.md) for any breaking changes — for non-major bumps, no code changes should be required.
4. Rebuild and verify dark mode + a few key surfaces render correctly.

---

## Repo layout

```
vuleng-design-system/
├── README.md, CHANGELOG.md, MIGRATION.md, CONTRIBUTING.md
├── package.json
├── index.css                # default entry: preset + Vulkan theme
├── preset.css               # core: variants, components, neutral tokens
├── themes/                  # brand themes (Vulkan + example client)
├── design/                  # design pillar (colors, components, etc.)
├── engineering/             # engineering pillar (Next, Supabase, etc.)
├── fragments/               # single-source-of-truth snippets
├── ai/plugin/               # Claude Code plugin
├── scripts/                 # build-fragments.mjs
└── logo.png, logo_dark.png
```

---

## License

UNLICENSED. Internal Vulkan Engineering use.
