---
fragment: neutral-mapping
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

<!-- Single source of truth for the light↔dark mode color mapping.
     Included into design/dark-mode.md. -->

## Light / Dark Color Mapping

The same semantic token resolves to different colors based on the active mode. The `.dark` class on `<html>` flips every variable below.

| Element | Light | Dark | Token |
|---------|-------|------|-------|
| Page background | `#F5F9FF` | `#0f172a` | `--color-page-bg` |
| Surface (card/header/sidebar) | `#ffffff` | `#1e293b` | `--color-surface` |
| Subtle surface | `#f7f9fb` | `#1e293b` | `--color-surface-subtle` |
| Elevated card | `#ffffff` | `#283548` | `--color-card-bg` |
| Layout border | `#dce3eb` | `#374151` | `--color-border` |
| Input border | `#c4ced9` | `#4a5e71` | `--color-border-input` |
| Primary text | `#1D1D1D` | `#e2e8f0` | `--color-text-default` |
| Secondary text | `#6b7d8f` | `#94a3b8` | `--color-text-muted` |
| Placeholder | `#94a3b4` | `#6b7d8f` | `--color-placeholder` |
| Input background | `#ffffff` | `#283548` | `--color-input-bg` |
| Disabled background | `#c4ced9` | `#364b5e` | `--color-disabled-bg` |
| Disabled foreground | `#6b7d8f` | `#6b7d8f` | `--color-disabled-fg` |
| Skeleton fill | `#edf1f5` | `#253a4d` | `--color-skeleton` |

## Elements That Don't Change in Dark Mode

- Brand primary (`#FF8935` Vulkan / `--color-brand-primary`) — same in both modes.
- Brand primary hover (`#F06400` Vulkan / `--color-brand-primary-hover`).
- Focus ring color (always brand primary).
- Spinner color (always brand primary).
- `--color-danger` (red) — same in both modes; status pairs use lighter text in dark mode but the base hue stays.

## Strategy

Class-based toggle on `<html>`. Preference stored in `localStorage` key `vulkan_dark_mode`. Falls back to system `prefers-color-scheme`.

The `.dark` class redefines the CSS variables; component classes in the preset all reference these variables, so no separate dark-mode component CSS is needed.
