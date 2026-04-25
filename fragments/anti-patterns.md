---
fragment: anti-patterns
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

<!-- Single source of truth for "what NOT to do". Included into design files
     and AI plugin skills. -->

## Anti-Patterns

### Color
- ❌ NEVER use orange (`vulkan-orange` / `brand-primary`) as a page background or large surface fill.
- ❌ NEVER use navy (`vulkan-navy` / `brand-accent`) as body text — too dark on light backgrounds. Navy is for headings only.
- ❌ NEVER use Tailwind's untinted `gray-*` in light mode. Use `neutral-*` (navy-tinted) instead.
- ❌ NEVER hardcode hex values when a CSS variable exists (`var(--color-brand-primary)`, etc.).
- ❌ NEVER invent custom hex values for status colors. Use the standard green/red/yellow/blue/purple from `fragments/colors-tokens.md`.

### Typography
- ❌ NEVER use a font other than Lato (or the theme's `--font-sans`).
- ❌ NEVER set `letter-spacing` or `line-height` on headings/body manually — the preset handles it.

### Components
- ❌ NEVER nest a `.card` inside another `.card`. Use the `embedded` variant pattern (flat background) for sub-blocks.
- ❌ NEVER use `confirm()` or `alert()` — use a modal component.
- ❌ NEVER use `outline: none` without a visible replacement focus indicator.
- ❌ NEVER use emoji in UI chrome (buttons, headers, labels, nav, toasts). SVG icons only. Emoji is OK in user-generated content.

### Motion
- ❌ NEVER use spring/bounce/elastic easing — motion is functional, not playful.
- ❌ NEVER animate layout properties (width, height, top, etc.). Use `transform`.
- ❌ NEVER ignore `prefers-reduced-motion: reduce`. The preset handles it globally.

### Accessibility
- ❌ NEVER convey meaning through color alone — pair with text, icons, or shape.
- ❌ NEVER omit `aria-label` on icon-only buttons.
- ❌ NEVER omit `lang` attribute on `<html>` (`no` for Norwegian, `en` for English).

### Theming (white-label apps)
- ❌ NEVER use `vulkan-*` aliases or `orange-{50–950}` / `navy-{50–950}` / `dark-*` ramps in code intended for white-label client deliveries — they are pinned to the Vulkan theme and won't follow client branding. Use semantic `brand-*` / `surface` / `text-default` tokens instead.
