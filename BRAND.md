# Brand Identity

> The non-negotiable visual elements that define Vulkan Engineering across all digital products.

## Logo

Two variants are required for every app:

| Variant | File | Usage |
|---------|------|-------|
| **Standard** | `logo.png` | Light backgrounds |
| **Dark** | `logo_dark.png` | Dark backgrounds / dark mode |

**Rules:**
- Always switch logos when dark mode toggles.
- Maintain aspect ratio — never stretch or crop.
- Minimum clear space: the logo's height on all sides.
- Maximum height in headers: `h-8` (2rem) to `h-10` (2.5rem).
- Use `object-contain` to preserve proportions.

**Implementation pattern:**

```html
<img :src="isDark ? logoDark : logoLight" alt="Vulkan Engineering" class="h-8 object-contain" />
```

## Colors

### Primary Palette

These three colors define Vulkan Engineering. Every app must use them.

| Name | Hex | Role |
|------|-----|------|
| **Vulkan Orange** | `#FF8935` | Primary accent — CTAs, active states, focus rings, links |
| **Vulkan Orange Hover** | `#F06400` | Hover/pressed state for orange elements |
| **Vulkan Navy** | `#183653` | Headings, strong emphasis, brand authority |

### Extended Orange Scale

For apps needing a broader range (e.g., heatmaps, charts, gradients):

| Step | Hex | Name |
|------|-----|------|
| 50 | `#fff8f0` | Lightest tint |
| 100 | `#ffedd9` | |
| 200 | `#ffd9b3` | |
| 300 | `#FFB885` | Oransje C (profilhåndbok) |
| **400** | **`#FF8935`** | **Oransje A — Primary** |
| **500** | **`#F06400`** | **Oransje B — Hover** |
| 600 | `#cc5500` | |
| 700 | `#a34400` | |
| 800 | `#7a3300` | |
| 900 | `#522200` | |
| 950 | `#331500` | Darkest shade |

### Extended Navy Scale

| Step | Hex | Name |
|------|-----|------|
| 50 | `#F5F9FF` | Light background (= `vulkan-bg`) |
| 100 | `#e0eaf4` | |
| 200 | `#b8cce0` | |
| 300 | `#8faec9` | |
| 400 | `#5c83a8` | |
| 500 | `#3a6389` | |
| 600 | `#2a4d6d` | |
| **700** | **`#183653`** | **Marineblå — Primary** |
| 800 | `#122a42` | |
| 900 | `#0d1f31` | |
| 950 | `#081420` | Deepest navy |

### Neutral Grays

| Step | Hex | Role |
|------|-----|------|
| 50 | `#f7f7f7` | Subtle backgrounds |
| 100 | `#efefef` | |
| 200 | `#dcdcdc` | Borders (light) |
| 300 | `#bdbdbd` | Input borders |
| 400 | `#989898` | Placeholder text |
| 500 | `#6e6e6e` | Secondary text |
| **600** | **`#3F3F3F`** | **Body text (profil)** |
| 700 | `#333333` | |
| **800** | **`#1D1D1D`** | **Svart (profil)** |
| 900 | `#141414` | |
| 950 | `#0a0a0a` | |

### Dark Mode Surfaces

| Token | Hex | Usage |
|-------|-----|-------|
| `dark-bg` | `#0f172a` | Page background |
| `dark-surface` | `#1e293b` | Headers, sidebars, cards, modals |
| `dark-card` | `#283548` | Elevated cards, filled inputs, dropdowns |

### Light Mode Background

| Token | Hex | Usage |
|-------|-----|-------|
| `vulkan-bg` | `#F5F9FF` | Page background (= Navy 50) |

### Status Colors

Use Tailwind's built-in color palette for semantic status. Do NOT invent custom status colors.

| Status | Tailwind Color | Example Usage |
|--------|---------------|---------------|
| Success / Open | `green-*` | Completion, approved, active |
| Error / Critical | `red-*` | Errors, critical severity, stop |
| Warning | `yellow-*` / `amber-*` | Warnings, attention needed |
| Info | `blue-*` | Informational, neutral action |
| Waiting / Hold | `violet-*` / `purple-*` | Pending, soak time, on hold |

## Typography

### Font: Lato

**Lato** is Vulkan Engineering's primary typeface (from profilhåndbok). Use it for everything — headings, body text, buttons, labels.

**Weights:**

| Weight | CSS | Usage |
|--------|-----|-------|
| 300 | `font-light` | De-emphasized text (sparingly) |
| 400 | `font-normal` | Body text, descriptions, input values |
| 700 | `font-bold` | Headings, labels, button text, emphasis |
| 900 | `font-black` | Badge text, counters (sparingly) |

**Loading:** Always load via Google Fonts with `display=swap`:

```html
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
```

**Tailwind config:**

```js
fontFamily: {
  sans: ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
}
```

### Heading Hierarchy

All headings: `font-weight: 700`, color `vulkan-navy` (light) / `gray-100` (dark).

| Level | Typical Size | Context |
|-------|-------------|---------|
| `h1` | `text-2xl` – `text-3xl` | Page titles |
| `h2` | `text-xl` – `text-2xl` | Section headers |
| `h3` | `text-lg` | Card titles, panel headers |
| `h4` | `text-base font-bold` | Sub-sections |
| Small | `text-sm`, `text-xs` | Labels, metadata, badges |

### Body Text

| Context | Size | Color (Light) | Color (Dark) |
|---------|------|---------------|--------------|
| Primary text | `text-base` | `gray-800` (`#3F3F3F`) | `gray-200` (`#e2e8f0`) |
| Secondary text | `text-sm` | `gray-500` (`#6B7280`) | `gray-400` (`#94a3b8`) |
| Caption / meta | `text-xs` | `gray-400` | `gray-500` |

## Iconography

**Library:** [Heroicons](https://heroicons.com) (MIT license, designed for Tailwind). Use the **outline** variant by default; use **solid** for active/selected states.

**Delivery:** Paste the SVG markup inline — no npm dependency needed.

```html
<!-- Example: chevron-right (outline, 24×24) -->
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
     stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>
```

**Rules:**
- Default size: `w-5 h-5` (20×20) for inline icons, `w-6 h-6` (24×24) for standalone.
- Color: always `currentColor` — inherits from parent text color.
- Stroke width: `1.5` (outline variant default).
- Never use icon fonts (Font Awesome, Material Icons). Inline SVG only.
- Keep SVGs accessible: add `aria-hidden="true"` for decorative icons, or `role="img"` + `aria-label` for meaningful ones.

## No Emojis in UI

**Emojis are banned from UI chrome** — buttons, headers, labels, nav items, and toasts must use SVG icons instead.

Emojis are acceptable only in user-generated content or data displays where the data itself contains emoji.

| Allowed | Not allowed |
|---------|-------------|
| SVG icon in a button | `📥 Download` |
| SVG icon in a toast | `🎉 Success!` |
| SVG icon in a nav item | `📄 Documents` |
| Emoji in a chat message (user content) | Emoji as a section header icon |

## Do's and Don'ts

| Do | Don't |
|----|-------|
| Use `vulkan-orange` for primary actions | Use orange for backgrounds or large surfaces |
| Use `vulkan-navy` for headings | Use navy for body text (too dark on light bg) |
| Use Lato for all text | Mix in other fonts |
| Use extended scales for charts/data viz | Invent new brand colors |
| Switch logo variants for dark mode | Show a dark logo on a dark background |
| Use Tailwind's built-in colors for status | Create custom hex values for red/green/blue |
