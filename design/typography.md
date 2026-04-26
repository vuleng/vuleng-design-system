---
file: design/typography.md
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

# Typography

> **What this is:** Font, weights, sizes, hierarchy, and text-wrap rules.
> **When to read it:** Before setting font-related styles. The preset already applies sensible defaults to `<h1>`–`<h6>`, `<p>`, `<li>`.
> **What it doesn't cover:** Component-specific text styles (button text, badge text) — see `components.md`.

## Font

**Lato** is the Vulkan default font. The active font is exposed as `--font-sans` and is theme-overridable — client themes may swap to Inter, Roboto, or another sans-serif while keeping the same hierarchy.

Load Lato (Vulkan default) via Google Fonts:

<!-- example: swap font for client themes that use a different family -->
```html
<link
  href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
  rel="stylesheet"
/>
```

Tailwind picks up `--font-sans` automatically: `font-sans` utility resolves to the active theme's font.

## Weights

| Weight | Tailwind | Use |
|--------|----------|-----|
| 300 | `font-light` | De-emphasized labels (sparingly) |
| 400 | `font-normal` | Body text, descriptions, input values |
| 700 | `font-bold` | Headings, button text, labels |
| 900 | `font-black` | Badge text, counters (sparingly) |

## Heading Hierarchy

All headings: weight 700, `letter-spacing: -0.02em` (`tracking-heading`), `line-height: 1.2` (`leading-heading`). The preset applies these via `@layer base`.

| Level | Tailwind size | Context |
|-------|---------------|---------|
| H1 | `text-2xl` – `text-3xl` | Page titles |
| H2 | `text-xl` – `text-2xl` | Section headers |
| H3 | `text-lg` | Card titles, panel headers |
| H4 | `text-base font-bold` | Sub-sections |

Heading color: `text-brand-accent` light / `text-text-default-dark` dark.

## Body Text

Body text uses `line-height: 1.6` (`leading-body`). Limit text blocks to `max-w-prose` (65ch) for readability.

| Role | Tailwind | Token |
|------|----------|-------|
| Primary | `text-base` | `text-text-default` |
| Secondary | `text-sm` | `text-text-muted` |
| Caption | `text-xs` | `text-placeholder` |

## Text Wrapping

| Class | Effect |
|-------|--------|
| `.text-balance` | `text-wrap: balance` — avoids orphans on headings |
| `.text-pretty` | `text-wrap: pretty` — improves line breaking on long body |

Apply `.text-balance` on every page title and section header. Apply `.text-pretty` on any paragraph longer than 3 lines.
