---
name: vulkan-ui
description: Vulkan Engineering design-system rules for UI work — colors, components, dark mode, typography, motion, accessibility, and theming. Use this skill whenever generating or reviewing UI code in a Vulkan project (or one that consumes @vuleng/design-system). Triggers include any mention of buttons, cards, inputs, badges, modals, layout, dark mode, theming, or specific tokens like vulkan-orange, vulkan-navy, brand-primary, brand-accent. Also trigger when user asks to "lag en knapp", "lag et card", "style this", "match Vulkan branding", or refers to design tokens, soft glass, navy-tinted neutrals, or the @vuleng/design-system package. Use when authoring a new client theme, when implementing dark mode, or when checking accessibility of UI elements.
---

# Vulkan UI Skill

You are working with `@vuleng/design-system` v2.x — a Tailwind v4-native design system with multi-theme support. Default brand: Vulkan Engineering. Other themes can swap colors/font/radii without forking.

## When this skill triggers

Read these files in order. Skip any that aren't relevant to the user's specific question:

1. **Always:** `design/00-overview.md` — orients you to the design pillar.
2. **Color tokens, hex values, palette questions:** `design/colors.md` (single source of truth; uses `fragments/colors-tokens.md`).
3. **Component classes (`btn-*`, `card`, `input-field`, etc.):** `design/components.md`. Reference `fragments/component-classes.md` for the bare API.
4. **Dark mode implementation or token mapping:** `design/dark-mode.md`.
5. **Typography (font, weights, hierarchy):** `design/typography.md`.
6. **Animations, transitions, easing:** `design/motion.md`.
7. **A11y (WCAG, ARIA, focus rings):** `design/accessibility.md`.
8. **Breakpoints, layout, mobile patterns:** `design/responsive.md`.
9. **Brand identity (logo, voice, no-emoji):** `design/brand.md`.
10. **Authoring a client theme:** `design/theming.md`.
11. **Always read before generating:** `fragments/anti-patterns.md`.

## Hard Rules (non-negotiable)

- All colors come from CSS tokens. Use semantic tokens (`bg-brand-primary`, `text-text-default`, `border-border`) for code that may ever ship to a white-label client. Use `vulkan-*` aliases or `orange-{50–950}` / `navy-{50–950}` ramps **only** in code permanently pinned to the Vulkan brand.
- Never use Tailwind's untinted `gray-*` in light mode. Use `neutral-*` (navy-tinted) instead.
- Never invent custom hex values for status colors — use the standard green/red/yellow/blue/purple from the colors fragment.
- Never use emoji in UI chrome (buttons, headers, toasts). Heroicons inline SVG only.
- Never nest a `.card` inside another `.card`.
- Always pair color with text/icon/shape — never convey meaning through color alone.
- Always provide dark-mode treatment using semantic tokens (which auto-flip) or `dark:` modifiers.
- Always set `aria-label` on icon-only buttons.
- Always set `<html lang="no">` (Norwegian default) or `<html lang="en">`.

## Common Patterns

### Primary CTA
```html
<button class="btn-primary">Lagre endringer</button>
```

### Card with hover
```html
<div class="card p-6 hover:shadow-elevation-2 transition-shadow">
  <h3 class="text-lg font-bold text-brand-accent dark:text-text-default-dark">Title</h3>
  <p class="mt-2 text-sm text-text-muted">Body</p>
</div>
```

### Input with label
```html
<label class="block">
  <span class="block text-sm font-bold text-text-default mb-1">Name</span>
  <input type="text" class="input-field" placeholder="Skriv her..." />
</label>
```

### Status badge
```html
<span class="badge bg-green-100 text-green-800 dark:bg-green-900/15 dark:text-green-300">
  Active
</span>
```

## Anti-Patterns

Always include the rules from `fragments/anti-patterns.md` when reviewing code. Common live failures:

- ❌ `bg-gray-100` in light mode → use `bg-neutral-100`
- ❌ `text-vulkan-navy` for body text → reserve navy for headings; use `text-text-default`
- ❌ Hardcoded `rgba(255, 137, 53, 0.5)` → use `rgb(var(--color-brand-primary-rgb) / 0.5)` or the `bg-brand-primary/50` utility
- ❌ Emoji in button labels → SVG icon

## Output Style

Generate Tailwind class strings using the design system's tokens. When in doubt, prefer **fewer custom utilities** and **more component classes** (`.btn-primary` over a stack of `bg-orange-400 text-white px-5 py-2 ...`). Always include dark-mode treatment in the same line.
