---
file: design/theming.md
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

# Theming — Authoring a Client Theme

> **What this is:** The contract for creating a new brand theme that swaps Vulkan's identity for a client's, without forking the design system.
> **When to read it:** When delivering a white-label / client-branded app. Skip if you're building a Vulkan-branded internal tool.
> **What it doesn't cover:** Density, type scale, or motion overrides — those are intentionally not themable. The system enforces consistency on those axes.

## What Themes Can Override

| Axis | Themable? | Notes |
|------|-----------|-------|
| Brand colors | ✅ Yes | Primary, primary-hover, primary-light, accent, accent-hover |
| Surfaces / borders / text | ✅ Yes | Light + dark variants |
| Font family | ✅ Yes | `--font-sans` |
| Component radii | ✅ Yes | Buttons, cards, inputs, badges |
| Shadow tint | ✅ Yes | `--color-shadow-rgb` |
| Density (padding) | ❌ No | Locked for system consistency |
| Typography scale | ❌ No | All themes use the same H1-H4 sizes |
| Motion durations / easings | ❌ No | All themes use the same timing |

## Quick Start

1. Copy `themes/example-acme.css` and rename it to your client (e.g. `themes/contoso.css`).
2. Replace the brand colors, font, and (optionally) radii.
3. Provide both light-mode (in `@theme`) and dark-mode (in `.dark`) values for surfaces, text, and borders.
4. Import in your app's main CSS:

   <!-- pattern: required client-theme override structure (preset before theme) -->
   ```css
   @import "@vuleng/design-system/preset";
   @import "./themes/contoso.css";
   ```

That's it — every component class (`.btn-primary`, `.card`, etc.) and Tailwind utility (`bg-brand-primary`, `text-text-default`) reflects the new theme.

## Required Tokens (light mode)

Every theme **must** define all of the following inside an `@theme` block. Missing any breaks at least one component.

<!-- pattern: required theme token structure — fill in hex/RGB values for your brand -->
```css
@theme {
  /* Brand */
  --color-brand-primary: <hex>;
  --color-brand-primary-rgb: <r g b>;
  --color-brand-primary-hover: <hex>;
  --color-brand-primary-hover-rgb: <r g b>;
  --color-brand-primary-light: <hex>;
  --color-brand-primary-light-rgb: <r g b>;

  --color-brand-accent: <hex>;
  --color-brand-accent-rgb: <r g b>;
  --color-brand-accent-hover: <hex>;
  --color-brand-accent-hover-rgb: <r g b>;

  /* Surfaces — light mode */
  --color-page-bg: <hex>;
  --color-surface: <hex>;
  --color-surface-rgb: <r g b>;
  --color-surface-subtle: <hex>;
  --color-surface-subtle-rgb: <r g b>;
  --color-card-bg: <hex>;
  --color-card-bg-rgb: <r g b>;

  /* Borders */
  --color-border: <hex>;
  --color-border-rgb: <r g b>;
  --color-border-input: <hex>;

  /* Text */
  --color-text-default: <hex>;
  --color-text-muted: <hex>;
  --color-placeholder: <hex>;

  /* Inputs */
  --color-input-bg: <hex>;

  /* Functional */
  --color-danger: #dc2626;       /* convention: keep semantic red */
  --color-danger-rgb: 220 38 38;
  --color-danger-hover: #b91c1c;
  --color-danger-hover-rgb: 185 28 28;
  --color-disabled-bg: <hex>;
  --color-disabled-fg: <hex>;
  --color-skeleton: <hex>;

  /* Shadow tint */
  --color-shadow-rgb: <r g b>;

  /* Optional overrides */
  --font-sans: "<font>", system-ui, sans-serif;
  --radius-button: <e.g. 0.5rem>;
  --radius-card: <e.g. 0.75rem>;
  --radius-input: <e.g. 0.5rem>;

  /* Dark-mode counterparts (referenced by some component states) */
  --color-text-default-dark: <hex>;
  --color-text-muted-dark: <hex>;
  --color-placeholder-dark: <hex>;
  --color-surface-rgb-dark: <r g b>;
  --color-card-bg-rgb-dark: <r g b>;
  --color-border-rgb-dark: <r g b>;
  --color-input-bg-dark: <hex>;
  --color-border-input-dark: <hex>;
  --color-disabled-bg-dark: <hex>;
  --color-disabled-fg-dark: <hex>;
  --color-skeleton-dark: <hex>;
}
```

## Dark Mode Block

<!-- pattern: required dark-mode override block — fill in hex/RGB values for your brand -->
```css
.dark {
  --color-page-bg: <hex>;
  --color-surface: <hex>;
  --color-surface-rgb: <r g b>;
  --color-card-bg: <hex>;
  --color-card-bg-rgb: <r g b>;
  --color-border: <hex>;
  --color-border-rgb: <r g b>;
  --color-text-default: <hex>;
  --color-text-muted: <hex>;
  --color-placeholder: <hex>;
  --color-input-bg: <hex>;
  --color-border-input: <hex>;
  --color-disabled-bg: <hex>;
  --color-disabled-fg: <hex>;
  --color-skeleton: <hex>;
}
```

## RGB Triplet Format

Tokens that participate in alpha overlays (`--color-brand-primary-rgb`, `--color-shadow-rgb`, etc.) use the **space-separated RGB triplet** format expected by the modern `rgb()` function:

<!-- pattern: required RGB triplet format (space-separated, unwrapped) -->
```css
--color-brand-primary-rgb: 255 137 53;   /* ✅ correct */
--color-brand-primary-rgb: 255, 137, 53; /* ❌ wrong (comma-separated) */
--color-brand-primary-rgb: rgb(255 137 53); /* ❌ wrong (wrapped) */
```

## Picking Brand Colors

A theme primary color must:
- Have ≥ 4.5:1 contrast against white text at full opacity (it'll be used on `.btn-primary` with white text).
- Have a darker variant for `-hover` (≈ 10–15% darker in lightness).
- Have a lighter variant for `-light` (used as a soft tint for hover backgrounds, not text).

A theme accent color must:
- Have ≥ 4.5:1 contrast against white (used on `.btn-accent`).
- Be visually distinct from primary (avoid two greens, two blues, etc.).
- Work as heading text on light backgrounds.

## Validation Checklist

Before shipping a theme:
- [ ] Every required token defined (light + dark)
- [ ] Primary and accent both pass WCAG AA against white
- [ ] Dark mode tested by toggling `.dark` on `<html>`
- [ ] Buttons (all 5), cards (all 3 elevations), inputs, selects, badges, skeletons render correctly
- [ ] Focus rings visible on every interactive element
- [ ] No `vulkan-*` or `orange-{50–950}` / `navy-{50–950}` references in the consuming app's code
- [ ] Disabled states have ≥ 3:1 contrast (text against disabled background)

## Anti-Patterns

- ❌ Don't override `--font-sans` to a custom font without loading the font in your `<head>`.
- ❌ Don't use the same color for primary and accent — confuses focus + heading semantics.
- ❌ Don't try to override component class CSS in your theme. Themes are CSS variables only. Component layout/density is system-locked.
- ❌ Don't forget the dark-mode counterpart variables — some components (disabled states, secondary buttons in dark mode) reference them by name.
- ❌ Don't use Tailwind v3 `colors:` extend in your tailwind config — v2 is Tailwind v4 native, all theming happens via `@theme` in CSS.
