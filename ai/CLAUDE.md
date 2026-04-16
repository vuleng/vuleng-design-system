# CLAUDE.md — Vulkan Engineering Design System

This file gives AI assistants (Claude, GitHub Copilot, Cursor, etc.) the design rules
for building Vulkan Engineering applications. Copy this file into the root of any
Vulkan project alongside the Tailwind preset.

---

## Design System: @vuleng/tailwind-preset

All Vulkan apps use a shared Tailwind CSS preset that provides brand tokens, component
classes, and a **soft glass** aesthetic with **navy-tinted neutrals**.

Install: `npm install github:vuleng/vuleng-design-system#v1.0.0`

```js
// tailwind.config.js (ESM)
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
export default {
  presets: [require('@vuleng/tailwind-preset')],
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,astro,html}'],
}
```

---

## Color Rules

### Brand colors (use Tailwind class names)
- `vulkan-orange` (#FF8935) — CTAs, focus rings, active states, links
- `vulkan-orange-hover` (#F06400) — hover/pressed on orange elements
- `vulkan-navy` (#183653) — headings, authority, emphasis
- `vulkan-bg` (#F5F9FF) — light mode page background

### Navy-tinted neutrals (MANDATORY in light mode)
Use `neutral-*` (50–950) for all grays in light mode. NEVER use Tailwind's untinted `gray-*`.

| Light mode | Dark mode | Purpose |
|-----------|-----------|---------|
| `text-neutral-800` | `dark:text-gray-200` | Primary text |
| `text-neutral-500` | `dark:text-gray-400` | Secondary text |
| `text-neutral-400` | `dark:text-gray-500` | Placeholder, caption |
| `border-neutral-200` | `dark:border-gray-700` | Layout borders |
| `border-neutral-300` | `dark:border-gray-600` | Input borders |
| `text-vulkan-navy` | `dark:text-gray-100` | Headings |

### Dark mode surfaces 
- `dark-bg` (#0f172a) — page background
- `dark-surface` (#1e293b) — headers, sidebars, cards
- `dark-card` (#283548) — elevated cards, inputs

### Rules
- Orange stays the same in both modes — no `dark:` variants on orange
- Never use orange as a page background or large surface fill
- Never use navy for body text
- Use Tailwind's built-in `green-*`, `red-*`, `yellow-*`, `blue-*` for status colors

---

## Component Classes (from preset — do NOT recreate)

### Buttons (soft glass with hover-lift)
```
.btn-primary     — Orange glass, WCAG AA, translateY(-1px) on hover
.btn-secondary   — White/surface glass
.btn-ghost       — Text-only, transparent background
.btn-danger      — Red glass for destructive actions
.btn-navy        — Navy glass
.btn-sm          — Smaller size modifier
.btn-lg          — Larger size modifier
```

### Cards (glass with elevation hierarchy)
```
.card            — Resting elevation: default cards, sections
.card-raised     — Mid elevation: hovered, selected, floating panels
.card-floating   — Highest: modals, dropdowns, popovers, toasts
```

### Form Elements
```
.input-field     — Full-width input (navy-tinted border, double-ring focus)
.select-field    — Styled native select
.badge           — Status pill
```

### Skeleton Loaders
```
.skeleton          — Base pulsing placeholder
.skeleton-text     — Single text line
.skeleton-heading  — Wider heading line
.skeleton-avatar   — Circular avatar
```

---

## Typography

**Font:** Lato only (loaded via Google Fonts, resolved by `font-sans`).

| Element | Style |
|---------|-------|
| Headings (h1-h6) | `font-bold tracking-heading leading-heading text-vulkan-navy dark:text-gray-100` |
| Body text | `leading-body` (1.6 line-height) |
| Text blocks | Limit to `max-w-prose` (65ch) |
| Headings wrapping | `text-balance` |
| Paragraphs | `text-pretty` |
| Badge/label text | `text-xs font-black tracking-wide uppercase` |

### Heading sizes
```
h1: text-2xl / text-3xl   — page titles
h2: text-xl / text-2xl    — section headers
h3: text-lg               — card titles
h4: text-base font-bold   — sub-sections
```

---

## Spacing

| Name | Value | Usage |
|------|-------|-------|
| Tight | `gap-1` (4px) | Icon + label |
| Compact | `gap-2` (8px) | Dense form groups |
| Default | `gap-3`–`gap-4` (12–16px) | Standard element groups |
| Section | `gap-6`–`gap-8` (24–32px) | Between page sections |
| Page | `py-12`–`py-16` (48–64px) | Top/bottom page padding |

---

## Shadow / Elevation

```
shadow-elevation-1  — resting (cards, sections)
shadow-elevation-2  — raised (hover, selection)
shadow-elevation-3  — floating (modals, dropdowns)
```

---

## Motion

- Micro-interactions: `200ms ease` (buttons, inputs — built into preset)
- Layout changes: `300ms ease-in-out` (sidebars, modals)
- Progress: `700ms ease-out`
- All buttons have `translateY(-1px)` hover-lift (built in, no extra CSS)
- `prefers-reduced-motion` handled globally by preset
- Never use `animate-bounce` or spring/elastic easing

---

## Icons

- Library: Heroicons (outline default, solid for active)
- Delivery: inline SVG only — no icon fonts, no emoji in UI
- Size: `w-5 h-5` inline, `w-6 h-6` standalone
- Color: `currentColor` via `stroke="currentColor"`
- Decorative: `aria-hidden="true"`
- Standalone: `role="img" aria-label="..."`

---

## Dark Mode

Class-based: `.dark` on `<html>`, stored in `localStorage` key `vulkan_dark_mode`.

Every visual element needs `dark:` variants for backgrounds, text, and borders.
Pattern for new components:
```
bg-white dark:bg-dark-surface
bg-vulkan-bg dark:bg-dark-bg
text-neutral-800 dark:text-gray-200
border-neutral-200 dark:border-gray-700
```

Always swap logo: `logo.png` (light) ↔ `logo_dark.png` (dark).

---

## Required Patterns

### Empty state
Icon (Heroicon, muted) + heading + description (`max-w-prose`) + optional CTA button.

### Error / retry
Red circle icon + heading + description + "Try Again" button (`.btn-secondary`).

### Button loading state
Spinner SVG (`animate-spin`) + action text ("Saving...") + `disabled` attribute.

### Skeleton loading
Use `.skeleton` / `.skeleton-text` / `.skeleton-heading` instead of spinners when layout is known.

### Modals
`role="dialog" aria-modal="true"`, backdrop `bg-black/60 backdrop-blur-sm`, panel uses `.card-floating`.

### Form validation
`aria-invalid="true" aria-describedby="error-id"`, red border + red error text with `role="alert"`.

---

## Anti-Patterns (NEVER do these)

- ❌ Use Tailwind's default `gray-*` in light mode (use `neutral-*`)
- ❌ Use orange as a background fill or large surface
- ❌ Use navy for body text
- ❌ Use `confirm()` / `alert()` (use modal components)
- ❌ Hardcode hex color values (use Tailwind tokens)
- ❌ Use `outline: none` without a focus indicator
- ❌ Use `animate-bounce` or spring/elastic easing
- ❌ Nest cards inside cards
- ❌ Use emoji in UI chrome (buttons, headers, labels, toasts)
- ❌ Add fonts other than Lato
- ❌ Use scoped CSS for dark mode overrides (use `dark:` classes)
- ❌ Use pure black (#000) or pure gray — always navy-tinted
- ❌ Create custom hex values for status colors (use Tailwind's built-in palettes)
- ❌ Use icon fonts (Font Awesome, Material Icons)

---

## Standard Requirements for Vulkan Applications

### Internationalization (i18n)
All Vulkan applications must support **Norwegian (nb)** and **English (en)** unless
single-language is explicitly specified. Norwegian is the default language.

- Use a context/provider pattern for locale state
- Store language preference in `localStorage` key `vulkan_language`
- All user-facing text must use translation keys — never hardcode strings in UI
- Prevent FOUC: read locale from `localStorage` before hydration
- All AI-generated content defaults to Norwegian

### Dark / Light Mode
All Vulkan applications must support dark and light mode.

- Class-based: `.dark` on `<html>`, stored in `localStorage` key `vulkan_dark_mode`
- Every visual element needs `dark:` variants (backgrounds, text, borders)
- Swap logo: `logo.png` (light) / `logo_dark.png` (dark)
- See DARK_MODE.md in the design system for full implementation guide

---

## Project Documentation

This project has focused documentation in `docs/`. Read ONLY what you need.

### Before starting a task, read:

| If you are working on... | Read... |
|--------------------------|---------|
| A page, route, or API endpoint | `docs/routes-and-pages.md` |
| Database tables, columns, RLS, migrations | `docs/database.md` |
| Auth, login, signup, roles, middleware | `docs/data-and-auth.md` |
| Tech stack, file structure, env vars, patterns | `docs/architecture.md` |
| A component's props or behavior | Read the component file directly |
| TypeScript types | Read the types file directly |
| Mutation/action signatures | Read the action file directly |
| Translation keys | Read the translation files directly |

Adjust this table to match your project's actual docs.

### After completing a task:
1. Update relevant doc file(s) — ONLY if you changed something the doc describes.
   Do NOT update docs for component props, types, or translations.
2. Update, add, or remove tests to match your changes. Run the test suite.
3. Run `npm run build` (or equivalent) to verify no breakage.

---

## Code Organization

- **Split by concern** — if a file does unrelated things, split it by domain
- **Shared components**: only in the shared folder if used by 2+ pages.
  Single-use components live with their page.
- **Descriptive names**: `user-actions.ts` not `actions.ts`, `grade-converter.ts` not `utils.ts`
- **No dead code**: remove unused files — grep for imports to verify
- **No barrel files**: avoid `index.ts` re-exports that obscure contents
- See DOCUMENTATION.md in the design system for the full standard

---

## Code Organization — Next.js

These apply when the project uses Next.js (App Router). See **NEXTJS.md** for full details.

- **Server actions**: split by domain in `app/actions/` (e.g. `location-actions.ts`, `user-actions.ts`). Shared auth helpers in a separate file. Zod validation first, then auth, then operation, then `revalidateTag()`.
- **Client components**: use `"use client"` directive only for interactivity (forms, toggles, search).
- **Data flow**: server components fetch data → pass as props → client components render.
- **Cache invalidation**: `revalidateTag()` after mutations (not `revalidatePath("/")`).
- **Route groups**: use `(group)/` folders for layout boundaries (e.g. `(app)/` for protected routes).
- **No `force-dynamic`**: let Next.js auto-detect. Never add `export const dynamic = "force-dynamic"`.
- **File conventions**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` follow Next.js standards.

---

## Code Organization — Astro + Sanity

These apply when the project uses Astro with Sanity CMS:

- **Pages**: `.astro` files in `src/pages/` — static by default, opt-in to SSR where needed
- **Content**: Sanity as the single source of truth. GROQ queries in dedicated query files, not scattered across components.
- **Islands**: use `client:load` only when interactivity is needed. Prefer `client:visible` for below-the-fold interactive components.
- **Styles**: Tailwind via the preset. Scoped styles in `.astro` files for component-specific overrides.
- **i18n**: Astro's built-in i18n routing (`/en/`, `/nb/`) with Sanity localized fields

---

## Testing

- Tests are updated in the **same commit** as the code they cover
- Run the test suite (`npm test` or equivalent) after making changes
- Add tests for new shared components and utility functions
- Remove tests for deleted code
- If a test fails after a UI change: update the test, don't skip it
- Server-side code that can't be imported in tests: test validation schemas separately

---

## Tech Stack Selection

See **STACK-GUIDE.md** for the full decision tree.

- **Dynamic webapp** (auth + database): Next.js + Supabase + Vercel
- **Content website** (CMS): Astro + Sanity + Vercel
- **Static site**: Astro/HTML + Vercel

---

## Performance (5 Critical Rules)

See **PERFORMANCE.md** for details, code examples, and measured results.

1. **Region co-location** — Vercel region MUST match Supabase region (`vercel.json`). Mismatch = +150ms per DB call.
2. **Auth deduplication** — `getClaims()` in middleware (~0ms). `React.cache()` on `getUser()` in layout/page (~50ms, runs once).
3. **Cache shared data** — `unstable_cache` + `revalidateTag` for locations, routes, etc. User data fetches fresh.
4. **Query discipline** — nested selects, `Promise.all`, specific columns on lists, no N+1 loops.
5. **No `force-dynamic`** — let Next.js auto-detect dynamic pages.

---

## Supabase Patterns

See **SUPABASE.md** for full auth and query patterns.

- **Two clients**: `createClient()` (user context, RLS) vs `createAdminClient()` (service role, no RLS)
- **Nested selects**: `.select("*, sector:sectors(name)")` instead of sequential queries
- **Cache with admin client**: `unstable_cache` callbacks use `createAdminClient()` (no cookie dependency)
- **Invalidate on mutation**: `revalidateTag("locations")` in server actions

---

## Deployment

See **DEPLOY.md** for setup details.

- **Vercel** for all web projects
- **`vercel.json`** with `regions` matching database region
- **Preview deployments** per PR (auto)
- **Environment variables** in Vercel dashboard (never commit secrets)

---

## Project Bootstrap

See **PROJECT-TEMPLATE.md** for complete directory structure, CLAUDE.md template,
and file naming conventions for new projects.
