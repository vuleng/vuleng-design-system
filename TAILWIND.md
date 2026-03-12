# Tailwind Configuration

> Shared Tailwind CSS setup for all Vulkan Engineering projects, delivered as a **preset**.

## Using the Preset (recommended)

Install the preset and reference it in your Tailwind config. All brand tokens, dark mode, and component classes (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.card`, `.input-field`, `.badge`) are included automatically.

```bash
# From a sibling folder (monorepo / local dev)
npm install ../vuleng-design-system
```

```js
// tailwind.config.js
export default {
  presets: [require('@vuleng/tailwind-preset')],
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx,astro,html}',
    // add your project-specific paths
  ],
  // Only extend if your app needs tokens beyond the preset
}
```

That's it. You get all the colors, fonts, dark mode, and component classes from the preset. Your project CSS only needs:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Manual Config (fallback)

If you can't use the preset as a dependency, copy the canonical config below:

```js
// tailwind.config.js (or .ts)
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx,astro,html}',
    './components/**/*.{vue,ts}',
    './pages/**/*.vue',
    './layouts/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        vulkan: {
          orange:         '#FF8935',
          'orange-hover': '#F06400',
          navy:           '#183653',
          bg:             '#F5F9FF',
        },
        dark: {
          bg:      '#0f172a',
          surface: '#1e293b',
          card:    '#283548',
        },
        orange: {
          50:  '#fff8f0', 100: '#ffedd9', 200: '#ffd9b3', 300: '#FFB885',
          400: '#FF8935', 500: '#F06400', 600: '#cc5500', 700: '#a34400',
          800: '#7a3300', 900: '#522200', 950: '#331500',
        },
        navy: {
          50:  '#F5F9FF', 100: '#e0eaf4', 200: '#b8cce0', 300: '#8faec9',
          400: '#5c83a8', 500: '#3a6389', 600: '#2a4d6d', 700: '#183653',
          800: '#122a42', 900: '#0d1f31', 950: '#081420',
        },
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Token Naming

| Token | Usage | Alternative keys seen in projects |
|-------|-------|----------------------------------|
| `vulkan.orange` | `bg-vulkan-orange` | `vulkan-orange`, `primary.400` |
| `vulkan.navy` | `text-vulkan-navy` | `vulkan-navy`, `secondary.700` |
| `vulkan.bg` | `bg-vulkan-bg` | `vulkan-bg` |
| `dark.surface` | `dark:bg-dark-surface` | `dark-surface` |

Both flat (`vulkan-orange`) and nested (`vulkan.orange`) produce the same Tailwind classes. The preset uses nested.

## CSS Custom Properties

Optional — add to your main CSS if you need values outside Tailwind (e.g., third-party theming):

```css
:root {
  --color-primary:       #FF8935;
  --color-primary-hover: #F06400;
  --color-header:        #183653;
  --color-bg:            #F5F9FF;
  --color-text:          #3F3F3F;
  --color-text-light:    #6B7280;
}

.dark {
  --color-header:     #e2e8f0;
  --color-bg:         #0f172a;
  --color-text:       #e2e8f0;
  --color-text-light: #94a3b8;
}
```

## Component Classes Reference

These are provided by the preset plugin. Do NOT redefine them in your project CSS.

| Class | Description |
|-------|-------------|
| `.btn-primary` | Orange soft-glass CTA button |
| `.btn-secondary` | White/surface outlined button |
| `.btn-ghost` | Text-only, transparent background |
| `.btn-danger` | Red soft-glass destructive button |
| `.card` | White/dark-surface container with border and rounded corners |
| `.input-field` | Full-width form input with focus ring |
| `.badge` | Small pill-shaped status indicator |

See [COMPONENTS.md](COMPONENTS.md) for full usage examples.
}
```

## Custom Scrollbar

For scroll containers that need a subtle, modern scrollbar:

```css
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(120,120,120,0.25) transparent;
}

.custom-scroll::-webkit-scrollbar {
  width: 7px;
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(120,120,120,0.18);
  border-radius: 6px;
  min-height: 40px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(120,120,120,0.32);
}

.dark .custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(180,180,180,0.13);
}

.dark .custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.18);
}
```

### Sidebar Accent Scrollbar

For sidebar navigation, use an orange-tinted scrollbar thumb to match the brand:

```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,137,53,0.35) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,137,53,0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,137,53,0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,137,53,0.2);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,137,53,0.4);
}
```

## PostCSS Config

Every project should use:

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Framework-Specific Setup

### Vue 3 / Nuxt 3

Import your CSS in `app.vue` or `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
})
```

### Astro

Import in your layout:

```astro
---
import '../styles/global.css'
---
```

### Vite (vanilla)

Import in `main.ts`:

```ts
import './style.css'
```
