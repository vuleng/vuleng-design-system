---
file: design/colors.md
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

# Colors

> **What this is:** Canonical reference for all color tokens in `@vuleng/design-system`.
> **When to read it:** Before picking a color hex. Always use a token, never raw hex.
> **What it doesn't cover:** Light↔dark mapping (see `dark-mode.md`), how to author a theme (see `theming.md`).

## Tokens

<!-- include: fragments/colors-tokens.md -->

## Usage

In Tailwind utilities:

```html
<button class="bg-brand-primary text-white">CTA</button>
<p class="text-text-muted">Secondary</p>
<div class="border border-border bg-surface">Card</div>
```

In CSS variables (for arbitrary values, animations, custom shadows):

```css
.my-glow {
  box-shadow: 0 0 12px rgb(var(--color-brand-primary-rgb) / 0.4);
}
```

## Color Rules

- ❌ NEVER use orange (`brand-primary`) as a page background or large surface fill.
- ❌ NEVER use accent (`brand-accent`) as body text — too dark on light backgrounds. Headings only.
- ❌ NEVER use Tailwind's untinted `gray-*` in light mode. Use `neutral-*` instead.
- ❌ NEVER hardcode hex when a token exists.
- ❌ NEVER invent custom hex values for status colors. Use the standard green/red/yellow/blue/purple in the table above.
- ✅ DO use semantic tokens (`brand-primary`, `surface`, `text-default`) in code intended for white-label/multi-tenant deliveries.
- ✅ DO use the Vulkan-specific `vulkan-*` aliases or `orange-{50–950}` / `navy-{50–950}` ramps **only** in code that will never be re-themed.
