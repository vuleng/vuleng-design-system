---
file: design/brand.md
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

# Brand Identity

> **What this is:** Brand-level rules for Vulkan Engineering — logo, voice, iconography, no-emoji policy.
> **When to read it:** When building anything that carries the Vulkan name. For client-themed deliveries, follow the client's brand guide instead.
> **What it doesn't cover:** Technical color tokens (see `colors.md`), typography hierarchy (see `typography.md`), component classes (see `components.md`).

## Logo

Two variants, one for each mode:

| Variant | File | Use |
|---------|------|-----|
| Standard | `logo.png` | Light backgrounds |
| Dark | `logo_dark.png` | Dark backgrounds / dark mode |

**Rules**
- Always switch logos when dark mode toggles.
- Maintain aspect ratio — never stretch or crop.
- Minimum clear space: the logo's height on all sides.
- Maximum height in headers: `h-8` (2rem) to `h-10` (2.5rem).
- Use `object-contain` to preserve proportions.

```html
<img
  src={isDark ? "/logo_dark.png" : "/logo.png"}
  alt="Vulkan Engineering"
  class="h-8 object-contain"
/>
```

## Tone of Voice

Professional, industrial, clean. Norwegian-first; English fully supported. Never playful, never slangy.

- ✅ "Lagrer endringer..."
- ❌ "Lagrer 🚀"
- ✅ "Could not load route data."
- ❌ "Oops! Something went wrong 😅"

## Iconography

**Library:** [Heroicons](https://heroicons.com) (MIT). Outline variant by default; solid for active/selected states.

**Delivery:** Inline SVG. No icon fonts, no emoji.

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  class="w-5 h-5"
  aria-hidden="true"
>
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>
```

| Context | Size |
|---------|------|
| Inline with text | `w-5 h-5` (20×20) |
| Standalone | `w-6 h-6` (24×24) |
| Empty state | `w-12 h-12` (48×48) |

Color: always `currentColor`. Stroke width: `1.5`.

**Accessibility**
- Decorative: `aria-hidden="true"`
- Standalone: `role="img"` + `aria-label="Description"`
- Icon-only buttons: `aria-label` on the button

## No Emojis in UI

Emojis are banned from UI chrome — buttons, headers, labels, nav items, and toasts must use SVG icons instead.

| Allowed | Not allowed |
|---------|-------------|
| SVG icon in a button | `📥 Download` |
| SVG icon in a toast | `🎉 Success!` |
| SVG icon in a nav item | `📄 Documents` |
| Emoji in user-generated content (chat, comments) | Emoji as a section header icon |

## Do's and Don'ts

| Do | Don't |
|----|-------|
| Use `brand-primary` (Vulkan orange) for primary actions | Use orange for backgrounds or large surfaces |
| Use `brand-accent` (Vulkan navy) for headings | Use navy for body text (too dark on light bg) |
| Use Lato (or theme `--font-sans`) for all text | Mix in other fonts mid-app |
| Switch logo variants for dark mode | Show a dark logo on a dark background |
| Use Tailwind's built-in semantic colors for status | Create custom hex values for red/green/blue |
| Use Heroicons inline | Use icon fonts or emoji |
