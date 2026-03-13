# Vulkan Engineering — Design System Instructions for GitHub Copilot

You are building a Vulkan Engineering application. Follow these design rules precisely.
This design system uses a **soft glass** aesthetic with **navy-tinted neutrals** — never generate generic "Tailwind template" UI.

## Brand Identity

**Colors** — use Tailwind token names, never raw hex:

| Token | Class | Usage |
|-------|-------|-------|
| `vulkan-orange` | `bg-vulkan-orange`, `text-vulkan-orange` | Primary CTAs, active states, focus rings, links |
| `vulkan-orange-hover` | `bg-vulkan-orange-hover` | Hover/pressed state of orange elements |
| `vulkan-navy` | `text-vulkan-navy` | Headings, strong emphasis |
| `vulkan-bg` | `bg-vulkan-bg` | Page background (light mode) |
| `dark-bg` | `dark:bg-dark-bg` | Page background (dark mode) |
| `dark-surface` | `dark:bg-dark-surface` | Headers, sidebars, cards (dark mode) |
| `dark-card` | `dark:bg-dark-card` | Elevated cards, inputs (dark mode) |

**Neutrals** — always use navy-tinted `neutral-*`, NEVER Tailwind's default `gray-*` in light mode:

| Purpose | Light mode | Dark mode |
|---------|-----------|-----------|
| Borders | `border-neutral-200` | `dark:border-gray-700` |
| Input borders | `border-neutral-300` | `dark:border-gray-600` |
| Placeholder | `text-neutral-400` | `dark:text-gray-500` |
| Secondary text | `text-neutral-500` | `dark:text-gray-400` |
| Primary text | `text-neutral-800` | `dark:text-gray-200` |
| Headings | `text-vulkan-navy` | `dark:text-gray-100` |

**Font:** Lato only. No other fonts. `font-sans` resolves to Lato via the preset.

## Component Classes (from preset)

Use these pre-built classes. Do NOT recreate them with raw Tailwind:

```
.btn-primary      — Orange glass CTA (WCAG AA compliant, includes hover-lift)
.btn-secondary    — White/surface glass supporting action
.btn-ghost        — Text-only, no background
.btn-danger       — Red glass for destructive actions
.btn-navy         — Navy glass for secondary emphasis
.btn-sm           — Smaller button size modifier
.btn-lg           — Larger button size modifier
.card             — Glass card (resting elevation)
.card-raised      — Elevated glass card
.card-floating    — Highest elevation (modals, dropdowns)
.input-field      — Full-width form input
.select-field     — Styled select dropdown
.badge            — Status pill indicator
.skeleton         — Loading placeholder base
.skeleton-text    — Text line skeleton
.skeleton-heading — Heading skeleton
.skeleton-avatar  — Circular avatar skeleton
```

## Dark Mode

Every component must include `dark:` variants. Pattern:

```
bg-white dark:bg-dark-surface              — surfaces
bg-vulkan-bg dark:bg-dark-bg               — page background
text-neutral-800 dark:text-gray-200        — primary text
text-neutral-500 dark:text-gray-400        — secondary text
text-vulkan-navy dark:text-gray-100        — headings
border-neutral-200 dark:border-gray-700    — layout borders
```

## Typography

- Headings: `font-bold tracking-heading leading-heading text-vulkan-navy dark:text-gray-100`
- Body: `leading-body` (line-height 1.6)
- Text blocks: limit to `max-w-prose` (65ch) for readability
- Use `text-balance` on headings, `text-pretty` on body paragraphs
- Badge/label text: `tracking-wide uppercase font-black text-xs`

## Layout & Spacing

- **Tight** (4px): `gap-1` — icon + label
- **Compact** (8px): `gap-2` — dense form groups
- **Default** (12–16px): `gap-3` to `gap-4` — standard groups
- **Section** (24–32px): `gap-6` to `gap-8` — between page sections
- **Page** (48–64px): `py-12` to `py-16` — page top/bottom

## Elevation Hierarchy

Use the right card level:

| Level | Class | Usage |
|-------|-------|-------|
| Resting | `.card` | Default cards, list items |
| Raised | `.card-raised` | Hovered/selected, floating panels |
| Floating | `.card-floating` | Modals, dropdowns, popovers |

Shadow utilities: `shadow-elevation-1`, `shadow-elevation-2`, `shadow-elevation-3`

## Icons

- Use Heroicons (outline variant, solid for active/selected)
- Inline SVG only — no icon fonts, no emoji in UI chrome
- Default size: `w-5 h-5`, standalone: `w-6 h-6`
- Always `currentColor` via `stroke="currentColor"`
- Decorative: `aria-hidden="true"`. Standalone: `role="img" aria-label="..."`

## Motion

- Hover/focus: `200ms ease` (built into preset buttons)
- Layout shifts: `300ms ease-in-out`
- Progress: `700ms ease-out`
- All buttons have `translateY(-1px)` hover-lift (built in)
- `prefers-reduced-motion` is handled globally by the preset
- Never use `animate-bounce` in production

## Patterns to Always Follow

- Always use `<button>` for actions, `<a>` for navigation
- Always add `aria-label` to icon-only buttons
- Modals: `role="dialog" aria-modal="true"`, use `.card-floating`
- Form errors: `aria-invalid="true" aria-describedby="error-id"`
- Loading buttons: show spinner SVG + "Saving..." text + `disabled`
- Empty states: icon + heading + description + optional CTA
- Skeleton loaders: use `.skeleton` classes instead of spinners when layout is known

## NEVER Do These

- Never use Tailwind's default `gray-*` in light mode — use `neutral-*`
- Never use orange as a page background or large surface fill
- Never use navy for body text (too dark on light backgrounds)
- Never use `confirm()` or `alert()` — use modal components
- Never hardcode hex color values — use Tailwind tokens
- Never use `outline: none` without a replacement focus indicator
- Never use `animate-bounce` or spring/elastic easing
- Never nest cards inside cards
- Never use emoji in UI chrome (buttons, headers, labels, toasts)
- Never add fonts other than Lato
- Never use scoped CSS for dark mode overrides — use Tailwind `dark:` classes
