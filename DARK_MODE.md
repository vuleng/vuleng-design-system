# Dark Mode

> Strategy, implementation, and checklist for dark mode across all Vulkan Engineering apps.

## Strategy

All Vulkan Engineering apps use **Tailwind's class-based dark mode** (`darkMode: 'class'`). The `.dark` class is toggled on the `<html>` element.

This approach is preferred over media-query dark mode because:
- Users can override their system preference.
- The choice persists across sessions via `localStorage`.
- It's consistent across all projects.

## Implementation

### 1. Toggle Logic

Use a composable (Vue) or utility function that:

1. Reads preference from `localStorage` (key: `vulkan_dark_mode`).
2. Falls back to `window.matchMedia('(prefers-color-scheme: dark)')`.
3. Applies `.dark` class to `document.documentElement`.
4. Persists changes to `localStorage`.

**Vue 3 example:**

```ts
import { ref, watch } from 'vue'

const STORAGE_KEY = 'vulkan_dark_mode'
const isDark = ref(loadPreference())

function loadPreference(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

applyTheme(isDark.value)

export function useDarkMode() {
  watch(isDark, (dark) => {
    applyTheme(dark)
    try { localStorage.setItem(STORAGE_KEY, String(dark)) } catch {}
  })

  return { isDark, toggle: () => { isDark.value = !isDark.value } }
}
```

**Vanilla JS example:**

```js
const STORAGE_KEY = 'vulkan_dark_mode'

function isDarkMode() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null) return stored === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function setDarkMode(dark) {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem(STORAGE_KEY, String(dark))
}

// Apply on load
setDarkMode(isDarkMode())
```

### 2. Toggle UI

Provide a toggle in the app's settings or header. Common patterns:

```html
<!-- Emoji toggle -->
<button @click="toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card">
  {{ isDark ? '☀️' : '🌙' }}
</button>
```

## Color Mapping: Light → Dark

### Surfaces

| Surface | Light | Dark | Tailwind |
|---------|-------|------|----------|
| Page background | `#F5F9FF` | `#0f172a` | `bg-vulkan-bg dark:bg-dark-bg` |
| Header / sidebar | `white` | `#1e293b` | `bg-white dark:bg-dark-surface` |
| Cards / modals | `white` | `#1e293b` | `bg-white dark:bg-dark-surface` |
| Elevated elements | — | `#283548` | `dark:bg-dark-card` |
| Empty inputs | `gray-50` | `dark-surface` | `bg-gray-50 dark:bg-dark-surface` |
| Filled inputs | `white` | `dark-card` | `bg-white dark:bg-dark-card` |

### Text

| Role | Light | Dark | Tailwind |
|------|-------|------|----------|
| Primary text | `gray-800` | `gray-200` | `text-gray-800 dark:text-gray-200` |
| Secondary text | `gray-500` | `gray-400` | `text-gray-500 dark:text-gray-400` |
| Headings | `vulkan-navy` | `gray-100` | `text-vulkan-navy dark:text-gray-100` |
| Disabled | `gray-400` | `gray-600` | `text-gray-400 dark:text-gray-600` |

### Borders

| Context | Light | Dark | Tailwind |
|---------|-------|------|----------|
| Layout dividers | `gray-200` | `gray-700` | `border-gray-200 dark:border-gray-700` |
| Input borders | `gray-300` | `gray-600` | `border-gray-300 dark:border-gray-600` |
| Button borders | `gray-200` | `gray-600` | `border-gray-200 dark:border-gray-600` |

### Colors That Stay the Same

These don't change between modes:

- `vulkan-orange` (`#FF8935`) — always the same hue
- `vulkan-orange-hover` (`#F06400`)
- Focus ring color (`ring-vulkan-orange`)
- Status badge colors (green, red, yellow, blue, purple)
- Spinner border color

### Status Badge Backgrounds

Status badges use transparent dark variants:

| Mode | Pattern |
|------|---------|
| Light | `bg-{color}-100 text-{color}-800` |
| Dark | `bg-{color}-900/30 text-{color}-300` |

Example: `bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`

## Logo

Always swap the logo for dark mode:

| Mode | Logo | Background |
|------|------|------------|
| Light | `logo.png` (dark logo) | Light surface |
| Dark | `logo_dark.png` (light logo) | Dark surface |

## Checklist: Dark Mode for New Components

Every visual element in a new component needs dark mode support. Walk through this list:

- [ ] **Backgrounds** — `dark:bg-dark-surface` or `dark:bg-dark-card`
- [ ] **Text color** — `dark:text-gray-100` (primary) or `dark:text-gray-400` (secondary)
- [ ] **Headings** — `dark:text-gray-100` (or covered by global rule)
- [ ] **Borders** — `dark:border-gray-600` or `dark:border-gray-700`
- [ ] **Hover backgrounds** — `dark:hover:bg-dark-card`
- [ ] **Input fields** — Background, border, text, and placeholder
- [ ] **Disabled states** — `dark:disabled:bg-gray-700 dark:disabled:text-gray-500`
- [ ] **Status indicators** — Use `dark:bg-{color}-900/30 dark:text-{color}-300` pattern
- [ ] **Shadows** — Check visibility; may need to reduce or remove on dark surfaces
- [ ] **Images / logos** — Ensure contrast; swap if needed
- [ ] **Scrollbars** — Apply `.custom-scroll` class with dark overrides

## Testing

1. Toggle via the UI control.
2. Verify all text is readable on all backgrounds.
3. Check that borders are visible (not too subtle on dark surfaces).
4. Confirm inputs show focus rings clearly.
5. Test badge/status colors for readability.
6. Verify logo is appropriate for the current theme.
