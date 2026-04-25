---
fragment: colors-tokens
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

<!-- This fragment is the SINGLE SOURCE OF TRUTH for color tokens.
     It is included verbatim into design/colors.md and AI plugin skills.
     Update tokens here, never in the consuming docs. -->

## Brand Colors (Vulkan default theme)

| Name | Hex | RGB | Role |
|------|-----|-----|------|
| Vulkan Orange | `#FF8935` | `255 137 53` | Primary accent — CTAs, focus rings, links, active states |
| Vulkan Orange Hover | `#F06400` | `240 100 0` | Hover/pressed for orange elements |
| Vulkan Orange Light | `#FFB885` | `255 184 133` | Soft tint, decorative |
| Vulkan Navy | `#183653` | `24 54 83` | Headings, brand authority, accent button |
| Vulkan Navy Hover | `#122A42` | `18 42 66` | Hover/pressed for navy elements |
| Vulkan Background | `#F5F9FF` | `245 249 255` | Light mode page background |

## Semantic Tokens (theme-overridable)

These are the canonical tokens for new code. They map to the active theme's brand:

| Token | Vulkan default | Use |
|-------|----------------|-----|
| `--color-brand-primary` | `#FF8935` | Primary CTA backgrounds, focus ring |
| `--color-brand-primary-hover` | `#F06400` | Hover state for primary |
| `--color-brand-primary-light` | `#FFB885` | Soft tint surfaces |
| `--color-brand-accent` | `#183653` | Heading text, accent buttons, secondary emphasis |
| `--color-brand-accent-hover` | `#122A42` | Hover state for accent |
| `--color-page-bg` | `#F5F9FF` (light) / `#0f172a` (dark) | Body background |
| `--color-surface` | `#ffffff` (light) / `#1e293b` (dark) | Cards, headers, sidebars |
| `--color-surface-subtle` | `#f7f9fb` (light) / `#1e293b` (dark) | Subtle background fill |
| `--color-card-bg` | `#ffffff` (light) / `#283548` (dark) | Elevated cards, dropdowns |
| `--color-border` | `#dce3eb` (light) / `#374151` (dark) | Layout borders |
| `--color-border-input` | `#c4ced9` (light) / `#4a5e71` (dark) | Input/select borders |
| `--color-text-default` | `#1D1D1D` (light) / `#e2e8f0` (dark) | Primary body text |
| `--color-text-muted` | `#6b7d8f` (light) / `#94a3b8` (dark) | Secondary text |
| `--color-placeholder` | `#94a3b4` (light) / `#6b7d8f` (dark) | Input placeholders |
| `--color-input-bg` | `#ffffff` (light) / `#283548` (dark) | Input/select backgrounds |
| `--color-danger` | `#dc2626` | Destructive actions, error states |
| `--color-disabled-bg` | `#c4ced9` (light) / `#364b5e` (dark) | Disabled button background |
| `--color-disabled-fg` | `#6b7d8f` | Disabled button text |
| `--color-skeleton` | `#edf1f5` (light) / `#253a4d` (dark) | Skeleton loader fill |
| `--color-shadow-rgb` | `24 54 83` (navy tint) | RGB triplet used in elevation shadows |

## Vulkan-Only Ramps

These scales are not theme-overridable. They exist only for the Vulkan theme. Do **not** use them in code that may ship to white-label clients — use `brand-primary` / `brand-accent` with alpha instead.

### Orange Ramp

| Step | Hex |
|------|-----|
| 50 | `#fff8f0` |
| 100 | `#ffedd9` |
| 200 | `#ffd9b3` |
| 300 | `#FFB885` |
| **400** | **`#FF8935`** ← Primary |
| **500** | **`#F06400`** ← Hover |
| 600 | `#cc5500` |
| 700 | `#a34400` |
| 800 | `#7a3300` |
| 900 | `#522200` |
| 950 | `#331500` |

### Navy Ramp

| Step | Hex |
|------|-----|
| 50 | `#F5F9FF` (= `vulkan-bg`) |
| 100 | `#e0eaf4` |
| 200 | `#b8cce0` |
| 300 | `#8faec9` |
| 400 | `#5c83a8` |
| 500 | `#3a6389` |
| 600 | `#2a4d6d` |
| **700** | **`#183653`** ← Primary |
| 800 | `#122a42` |
| 900 | `#0d1f31` |
| 950 | `#081420` |

### Navy-Tinted Neutrals

Replaces Tailwind's untinted `gray-*` in light mode. Do **not** use bare `gray-*` for light-mode surfaces or text.

| Step | Hex | Role |
|------|-----|------|
| 50 | `#f7f9fb` | Subtle backgrounds |
| 100 | `#edf1f5` | Skeleton loaders, light fills |
| 200 | `#dce3eb` | Layout borders |
| 300 | `#c4ced9` | Input borders |
| 400 | `#94a3b4` | Placeholder text |
| 500 | `#6b7d8f` | Secondary text |
| 600 | `#4a5e71` | Body text (secondary emphasis) |
| 700 | `#364b5e` | Strong secondary text |
| 800 | `#253a4d` | High-contrast text |
| 900 | `#1a2c3d` | Near-black |
| 950 | `#0f1c2a` | Deepest shade |

## Status Colors

Use Tailwind's built-in palette. Do **not** invent custom hex for status.

| Status | Family | Light bg / text | Dark bg / text |
|--------|--------|-----------------|----------------|
| Success | Green | `#dcfce7` / `#166534` | `rgb(34 197 94 / 0.15)` / `#86efac` |
| Error | Red | `#fee2e2` / `#991b1b` | `rgb(239 68 68 / 0.15)` / `#fca5a5` |
| Warning | Yellow/Amber | `#fef9c3` / `#854d0e` | `rgb(234 179 8 / 0.15)` / `#fde047` |
| Info | Blue | `#dbeafe` / `#1e40af` | `rgb(59 130 246 / 0.15)` / `#93c5fd` |
| Pending | Purple | `#f3e8ff` / `#6b21a8` | `rgb(168 85 247 / 0.15)` / `#d8b4fe` |
