# Vulkan Engineering — Design System

> The shared visual identity and styling reference for all Vulkan Engineering digital products.

This design system defines the colors, typography, components, and patterns that make a Vulkan Engineering app *feel like* a Vulkan Engineering app — regardless of framework, project, or team.

## Who is this for?

Any developer building a Vulkan Engineering product: internal tools, customer-facing apps, websites, dashboards, or services. Copy the Tailwind config, follow the patterns, and your app will fit the family.

## Documents

| Document | What it covers |
|----------|---------------|
| [BRAND.md](BRAND.md) | Core identity — colors, logo, typography, the non-negotiables |
| [TAILWIND.md](TAILWIND.md) | Ready-to-use Tailwind config, CSS custom properties, global classes |
| [COMPONENTS.md](COMPONENTS.md) | Reusable UI patterns — buttons, cards, inputs, modals, toasts, badges |
| [DARK_MODE.md](DARK_MODE.md) | Dark mode strategy, color mappings, implementation checklist |
| [ANIMATIONS.md](ANIMATIONS.md) | Motion guidelines — timing, easing, transition patterns |
| [RESPONSIVE.md](RESPONSIVE.md) | Breakpoints, layout conventions, mobile-first approach |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | ARIA, keyboard, focus, contrast — the non-negotiable minimums |

## Quick Start

### 1. Install Tailwind & Lato

```bash
npm install -D tailwindcss postcss autoprefixer
```

Add Lato to your `index.html` or layout:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
```

### 2. Copy the Tailwind Config

See [TAILWIND.md](TAILWIND.md) for the full config. The minimum:

```js
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vulkan: {
          orange:       '#FF8935',
          'orange-hover': '#F06400',
          navy:         '#183653',
          bg:           '#F5F9FF',
        },
        dark: {
          bg:      '#0f172a',
          surface: '#1e293b',
          card:    '#283548',
        },
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### 3. Add the Global Styles

Copy the base layer from [TAILWIND.md](TAILWIND.md) into your main CSS file.

### 4. Build Components

Follow the patterns in [COMPONENTS.md](COMPONENTS.md). Every component should support dark mode ([DARK_MODE.md](DARK_MODE.md)) and meet accessibility standards ([ACCESSIBILITY.md](ACCESSIBILITY.md)).

## Projects Using This System

| Project | Stack | Notes |
|---------|-------|-------|
| **OpsNav Pro** (procedure app) | Vue 3 + Vite + Tailwind | PWA for plant operators |
| **Vuleng ISO9001** | Nuxt 3 + Tailwind | Internal quality management |
| **Vulkan Engineering Website** | Astro + Tailwind | Public company website |

## Principles

1. **Consistency over creativity.** A Vulkan app should look like a Vulkan app. Use the defined palette, not custom colors.
2. **Dark mode is not optional.** Every surface, text, and border needs a dark variant.
3. **Mobile-first, always.** Base styles target phones. Enhance with breakpoints.
4. **Accessible by default.** Focus rings, ARIA labels, keyboard support — built in, not bolted on.
5. **Tailwind-first.** Use utility classes in templates. Reserve CSS files for shared global classes only.
