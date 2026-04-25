---
fragment: component-classes
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

<!-- Single source of truth for the component class API exposed by the
     preset. Property values for each class live in preset.css; this
     fragment is the developer-facing reference. -->

## Component Class Reference

All classes are theme-aware: they reference `var(--color-*)` tokens that swap when a different theme is loaded. Sizes and behavior are not theme-overridable.

### Buttons

| Class | Variant | Use |
|-------|---------|-----|
| `.btn-primary` | Brand primary CTA, soft glass | Main action on a page or modal |
| `.btn-secondary` | Glass-white | Cancel, secondary actions |
| `.btn-ghost` | Text-only, accent color | Tertiary actions, in-row buttons |
| `.btn-danger` | Red glass | Destructive actions (delete, discard) |
| `.btn-accent` | Brand accent solid | Strong emphasis on accent (replaces v1 `.btn-navy`) |
| `.btn-navy` | **Legacy alias** of `.btn-accent` | Kept for v1.x apps; prefer `.btn-accent` in new code |

Modifiers: `.btn-sm` (compact), `.btn-lg` (prominent).

All buttons except `.btn-ghost` lift `1px` on hover (`translateY(-1px)`).

### Cards

| Class | Elevation | Use |
|-------|-----------|-----|
| `.card` | Resting (level 1) | Default cards in lists/grids |
| `.card-raised` | Raised (level 2) | Selected, hovered, or emphasis cards |
| `.card-floating` | Floating (level 3) | Modals, dropdowns, popovers |

All cards have backdrop blur and a navy-tinted (theme-tinted) shadow. Never nest a card inside another card — use a flat `bg-surface-subtle` block instead.

### Inputs

| Class | Use |
|-------|-----|
| `.input-field` | Text input, textarea, number input |
| `.select-field` | Native `<select>` with custom chevron |

Both have a double-ring orange focus state (`var(--color-brand-primary)`).

### Badge

| Class | Use |
|-------|-----|
| `.badge` | Pill-shaped status indicator. Pair with status colors from `colors-tokens.md` |

### Skeletons (loading placeholders)

| Class | Use |
|-------|-----|
| `.skeleton` | Generic block — set `width`/`height` via Tailwind utilities |
| `.skeleton-text` | Single text line (height 14px) |
| `.skeleton-heading` | Heading placeholder (height 24px, width 60%) |
| `.skeleton-avatar` | Round avatar (40×40px) |

All skeletons pulse with a 2-second cubic-bezier animation.

### Shadows (Tailwind utilities)

| Utility | Elevation |
|---------|-----------|
| `shadow-elevation-1` | Resting |
| `shadow-elevation-2` | Raised |
| `shadow-elevation-3` | Floating |

Shadows are tinted via `--color-shadow-rgb`. Vulkan default is navy (`24 54 83`).

### Text Utilities

| Utility | Effect |
|---------|--------|
| `.text-balance` | `text-wrap: balance` (avoid orphans on headings) |
| `.text-pretty` | `text-wrap: pretty` (improve body line breaking) |
