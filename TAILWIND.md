# Tailwind Configuration

> The shared Tailwind CSS setup for all Vulkan Engineering projects. Copy, paste, build.

## Recommended Tailwind Config

This is the canonical config. All projects should use these exact token names and values to ensure cross-project consistency.

```js
// tailwind.config.js (or .ts)
export default {
  darkMode: 'class',
  content: [
    // Adjust to your project's structure
    './src/**/*.{vue,js,ts,jsx,tsx,astro,html}',
    './components/**/*.{vue,ts}',
    './pages/**/*.vue',
    './layouts/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand ──
        vulkan: {
          orange:         '#FF8935',   // Primary accent
          'orange-hover': '#F06400',   // Hover state
          navy:           '#183653',   // Headings, emphasis
          bg:             '#F5F9FF',   // Light mode background
        },

        // ── Dark mode surfaces ──
        dark: {
          bg:      '#0f172a',          // Page background
          surface: '#1e293b',          // Header, sidebar, cards
          card:    '#283548',          // Elevated elements
        },

        // ── Extended scales (optional, for detailed UI) ──
        orange: {
          50:  '#fff8f0',
          100: '#ffedd9',
          200: '#ffd9b3',
          300: '#FFB885',
          400: '#FF8935',              // = vulkan.orange
          500: '#F06400',              // = vulkan.orange-hover
          600: '#cc5500',
          700: '#a34400',
          800: '#7a3300',
          900: '#522200',
          950: '#331500',
        },
        navy: {
          50:  '#F5F9FF',              // = vulkan.bg
          100: '#e0eaf4',
          200: '#b8cce0',
          300: '#8faec9',
          400: '#5c83a8',
          500: '#3a6389',
          600: '#2a4d6d',
          700: '#183653',              // = vulkan.navy
          800: '#122a42',
          900: '#0d1f31',
          950: '#081420',
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

### Notes on Token Naming

The projects currently use slightly different structures. This config unifies them:

| Token | Usage | Alternative keys seen in projects |
|-------|-------|----------------------------------|
| `vulkan.orange` | `bg-vulkan-orange` | `vulkan-orange`, `primary.400` |
| `vulkan.navy` | `text-vulkan-navy` | `vulkan-navy`, `secondary.700` |
| `vulkan.bg` | `bg-vulkan-bg` | `vulkan-bg` |
| `dark.surface` | `dark:bg-dark-surface` | `dark-surface` |

Both flat (`vulkan-orange`) and nested (`vulkan.orange`) structures produce the same Tailwind classes. Choose nested for readability.

## CSS Custom Properties

Add these to your main CSS file for use in global styles and plain CSS:

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

These are useful for:
- Global style rules (headings, body)
- CSS-in-JS or scoped styles that can't use Tailwind directly
- Third-party component theming

## Global Base Styles

Add to your main CSS file (e.g., `style.css`, `main.css`, `global.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: 'Lato', system-ui, sans-serif;
    color: var(--color-text);
    background-color: var(--color-bg);
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--color-header);
    font-weight: 700;
  }

  .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
    color: #e2e8f0;
  }

  [v-cloak] {
    display: none;
  }
}
```

## Global Component Classes

These go in `@layer components` — shared across all projects:

```css
@layer components {
  /* ── Buttons ── */
  .btn-primary {
    @apply bg-vulkan-orange text-white font-bold px-6 py-3 rounded-lg
           hover:bg-vulkan-orange-hover hover:-translate-y-px active:translate-y-0
           disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:translate-y-0
           dark:disabled:bg-gray-700 dark:disabled:text-gray-500
           transition-all shadow-[0_4px_6px_-1px_rgba(255,137,53,0.2)]
           hover:shadow-[0_6px_8px_-1px_rgba(255,137,53,0.3)];
  }

  .btn-secondary {
    @apply bg-white dark:bg-dark-surface text-vulkan-navy dark:text-gray-200
           border border-gray-200 dark:border-gray-600 font-semibold px-4 py-2 rounded-lg
           hover:border-vulkan-navy dark:hover:border-gray-400
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-all;
  }

  /* ── Cards ── */
  .card {
    @apply bg-white dark:bg-dark-surface
           border border-gray-200 dark:border-gray-700
           rounded-xl shadow-sm;
  }

  /* ── Form inputs ── */
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
           bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
           placeholder-gray-400 dark:placeholder-gray-500
           focus:ring-2 focus:ring-vulkan-orange focus:border-transparent
           transition-colors;
  }

  /* ── Badges ── */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold;
  }
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
