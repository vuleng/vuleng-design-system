---
file: design/00-overview.md
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

# Design — Overview

> **What this is:** The design pillar of `@vuleng/design-system` — colors, typography, components, motion, accessibility, and theming.
> **When to read it:** Before writing any UI. Especially when starting a new app, or when implementing a client-branded delivery.
> **What it doesn't cover:** Engineering choices (Next.js, Supabase, deploy) — see `engineering/00-overview.md`.

## Click Path

| If you need to… | Read |
|------------------|------|
| Understand the brand voice, logo rules, no-emoji policy | [`design/brand.md`](brand.md) |
| Look up color tokens (semantic, brand, neutrals, status) | [`design/colors.md`](colors.md) |
| Apply typography (font, weights, hierarchy) | [`design/typography.md`](typography.md) |
| Use a component class (`.btn-primary`, `.card`, etc.) | [`design/components.md`](components.md) |
| Implement dark mode | [`design/dark-mode.md`](dark-mode.md) |
| Add motion or transitions | [`design/motion.md`](motion.md) |
| Hit responsive breakpoints | [`design/responsive.md`](responsive.md) |
| Meet a11y requirements | [`design/accessibility.md`](accessibility.md) |
| Author a client theme | [`design/theming.md`](theming.md) |

## Install

<!-- pattern: required install command -->
```bash
npm install github:vuleng/vuleng-design-system#v2.0.0
```

In your project's main CSS file:

<!-- pattern: required default-theme import -->
```css
@import "@vuleng/design-system";
```

This imports both the core preset and the Vulkan brand theme. For client-themed apps:

<!-- pattern: required client-theme override structure -->
```css
@import "@vuleng/design-system/preset";
@import "./themes/your-client-theme.css";
```

See [`theming.md`](theming.md) for how to author a client theme.

## Brand Aesthetic

**Soft glass with navy-tinted neutrals.** Surfaces are semi-transparent with backdrop blur. Borders are thin and tinted toward the brand accent. Shadows use the brand-accent color at low alpha rather than pure black. Motion is functional, not decorative.

The Vulkan default theme uses:
- **Primary:** Vulkan Orange `#FF8935` (CTAs, focus rings, links)
- **Accent:** Vulkan Navy `#183653` (headings, brand authority, accent buttons)
- **Background:** Lyseblå `#F5F9FF` (light) / `#0f172a` (dark)
- **Font:** Lato (300/400/700/900)

A client theme overrides primary, accent, fonts, and shadow tint without changing component shape, density, or motion.

## Anti-Patterns

<!-- include: fragments/anti-patterns.md -->
