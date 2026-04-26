---
file: engineering/nextjs.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-26
---

# Next.js App Router — Overview, Project Structure & Conventions

> **What this is:** Cross-cutting Next.js 15+ App Router conventions for Vulkan apps — project structure, server/client component split, loading & error boundaries, file naming, i18n, and the Supabase client cheat sheet.
> **When to read it:** When orienting in a new Vulkan repo, deciding where a file belongs, or wiring up a fresh route segment.
> **What it doesn't cover:** Topic-specific patterns split into siblings:
> - [`nextjs-auth.md`](nextjs-auth.md) — middleware, getClaims, role gating, server-action auth helpers
> - [`nextjs-data.md`](nextjs-data.md) — server-component fetches, parallel queries, `unstable_cache`, server actions
> - [`nextjs-forms.md`](nextjs-forms.md) — Zod forms, modals, Cmd+K search
> - [`testing.md`](testing.md) — Vitest, RTL, Zod schema testing, Supabase mocks
> - UI component classes → `design/components.md`; Supabase RLS → `supabase.md`; deployment → `deploy.md`.
> **Quick reference:** `fragments/nextjs-essentials.md` is a 1-page summary for AI plugin context.

Playbook for AI agents and humans building Vulkan Engineering applications with Next.js 15+ App Router and Supabase.

## Table of Contents

- [Project Structure](#project-structure)
- [Server vs Client Components](#server-vs-client-components)
- [Loading States](#loading-states)
- [File Naming Conventions](#file-naming-conventions)
- [i18n](#i18n)
- [Error Boundaries](#error-boundaries)
- [Anti-Patterns (Architecture)](#anti-patterns-architecture)
- [Quick Reference: Supabase Client Selection](#quick-reference-supabase-client-selection)
- [Where to go next](#where-to-go-next)

---

## Project Structure

<!-- example: substitute your own routes, actions, and components — the route-group / actions / lib / __tests__ shape is the canonical skeleton -->
```
src/
  app/
    (app)/                    # Authenticated route group
      layout.tsx              # Auth guard + nav shell
      loading.tsx             # Root Suspense fallback
      error.tsx               # Root error boundary
      home/                   # Dashboard
        page.tsx
        loading.tsx
        dashboard-client.tsx
        widgets/              # Co-located widget components
      locations/
        page.tsx              # Server component -- fetches data
        locations-client.tsx  # Client component -- interactivity
        loading.tsx
        [id]/
          page.tsx
          loading.tsx
      routes/
        [id]/
          page.tsx
          loading.tsx
          not-found.tsx       # Route-level 404
          my-ascents-on-route.tsx
      admin/
        page.tsx
        tabs/                 # Tab content components
        tools/                # Admin tool panels
        locations/
          [id]/
            edit/
            topo/
            ai-crop/
      sectors/[id]/
      users/[id]/
      sessions/[id]/
      leaderboard/
      log/
      stats/
    actions/                  # Server actions (split by domain)
      auth-helpers.ts
      location-actions.ts
      route-actions.ts
      sector-actions.ts
      ascent-actions.ts
      session-actions.ts
      log-actions.ts
      search-actions.ts
      dashboard-actions.ts
      ai-actions.ts
    api/                      # API route handlers
      ai/
        extract-route/route.ts
        crop-sectors/route.ts
        suggest-location/route.ts
      weather/route.ts
    auth/
      callback/route.ts       # Supabase auth callback
    login/page.tsx             # Public pages
    signup/page.tsx
    layout.tsx                 # Root layout (providers, fonts)
    globals.css
  components/
    ui/                        # Reusable primitives
      grade-badge.tsx
      style-badge.tsx
      route-list-item.tsx
      sector-card.tsx
      location-card.tsx
      back-link.tsx
      empty-state.tsx
      spinner.tsx
      error-alert.tsx
    nav.tsx                    # Navigation bar
    route-form.tsx             # Shared form components
    route-card.tsx
    ascent-form.tsx
    log-ascent-modal.tsx
    session-form.tsx
    session-modal.tsx
    global-search.tsx
    confirm-modal.tsx
    favorite-toggle.tsx
  lib/
    auth/
      access.ts               # React.cache() auth + role checks
    supabase/
      server.ts                # Server-side Supabase client
      client.ts                # Browser-side Supabase client
      admin.ts                 # Service-role client (bypasses RLS)
      middleware.ts            # Session refresh + JWT validation
    cache.ts                   # unstable_cache wrappers + tag helpers
    validation/
      mutations.ts             # Zod schemas for all mutations
    i18n/
      index.tsx                # LanguageProvider + useT() hook
      t-component.tsx          # <T k="..." /> for server components
      translations/
        nb.json
        en.json
    constants.ts
    utils.ts
  types/
    database.ts                # Supabase-generated + manual types
  __tests__/                   # Mirrors src/ structure
    actions/
    components/
      ui/
    lib/
  middleware.ts                # Edge middleware entry point
```

Key rules:
- Route group `(app)` wraps all authenticated pages behind a shared layout
- Public pages (`login`, `signup`, `forgot-password`) live outside the group
- Server actions are split by domain, never bundled into one giant file
- Components under `ui/` are pure display primitives; larger form/modal components live in `components/`
- Zod schemas live in `lib/validation/`, never inline in action files

---

## Server vs Client Components

Server components are the default. Add `"use client"` only when you need browser APIs, hooks, or event handlers.

### Server components (default)

Use for: pages, layouts, data fetching, static content.

<!-- example: substitute your own page name and queries -->
```tsx
// src/app/(app)/locations/page.tsx -- server component (no directive needed)
import { redirect } from "next/navigation";
import { getCurrentUserWithProfile } from "@/lib/auth/access";
import { getCachedLocationsList, getCachedSectors, getCachedRouteGrades } from "@/lib/cache";
import LocationsClient from "./locations-client";

export default async function LocationsPage() {
  const { user } = await getCurrentUserWithProfile();
  if (!user) redirect("/login");

  const [locations, sectors, routes] = await Promise.all([
    getCachedLocationsList(),
    getCachedSectors(),
    getCachedRouteGrades(),
  ]);

  // Compute derived data on the server (Maps, aggregations, etc.)
  // ...

  return <LocationsClient locations={enriched} />;
}
```

### Client components

Use for: forms, modals, search, toggles, keyboard listeners, anything with `useState`/`useEffect`.

<!-- example: substitute your own client component (the `"use client"` directive + dynamic import for heavy children is the canonical shape) -->
```tsx
// src/app/(app)/locations/locations-client.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useT } from "@/lib/i18n";

// Lazy-load heavy components that aren't needed on first render
const LocationMap = dynamic(() => import("@/components/location-map"), { ssr: false });

export default function LocationsClient({ locations }: { locations: EnrichedLocation[] }) {
  const t = useT();
  const [search, setSearch] = useState("");

  const filtered = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-vulkan-navy dark:text-gray-100">
        {t("locations.title")}
      </h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
      />
      {/* ... */}
    </div>
  );
}
```

### Decision matrix

| Need | Component type |
|------|---------------|
| Fetching data from Supabase | Server |
| Auth checks / redirects | Server |
| Static display of passed props | Server |
| useState, useEffect, useRef | Client |
| onClick, onChange, onSubmit | Client |
| useRouter, usePathname | Client |
| useT() for translations | Client |
| Browser APIs (localStorage, IntersectionObserver) | Client |

### The page + client split pattern

The standard pattern for interactive pages: a server component page fetches data, then hands it to a client component for interactivity.

<!-- pattern: required server-page → client-component split for any interactive page -->
```
page.tsx (server)  -->  fetches data, auth check
  |
  v
some-client.tsx ("use client")  -->  search, filters, modals, etc.
```

---

## Loading States

### loading.tsx per route

Every route segment with async data should have a `loading.tsx`. Next.js wraps the page in a `<Suspense>` boundary using this file as the fallback.

<!-- example: substitute your own root-loading visual; the file location and named-export shape are canonical -->
```tsx
// src/app/(app)/loading.tsx -- root loading for the app group
export default function AppLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* Custom animated SVG climber */}
    </div>
  );
}
```

For nested routes, re-export the parent loading if the skeleton is the same:

<!-- pattern: required parent-loading re-export shape (`export { default } from ...`) -->
```tsx
// src/app/(app)/locations/[id]/loading.tsx
export { default } from "../../loading";
```

### Skeleton loaders for known layouts

When you know the page structure, use `.skeleton` classes instead of spinners:

<!-- example: substitute your own page skeleton — the .skeleton / .skeleton-text / .skeleton-heading classes are canonical -->
```tsx
export default function LocationDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="skeleton-heading w-48 mb-4" />
      <div className="skeleton-text w-full mb-2" />
      <div className="skeleton-text w-3/4 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="skeleton h-48 rounded-xl" />
        <div className="skeleton h-48 rounded-xl" />
      </div>
    </div>
  );
}
```

### next/dynamic for lazy-loaded heavy components

Defer loading of components that aren't needed on first paint (maps, search modals, session modals):

<!-- pattern: required dynamic-import shape (`dynamic(() => import(...), { ssr: false })`) for client-only heavy components -->
```tsx
// In nav.tsx -- these render only when opened
const GlobalSearch = dynamic(() => import("@/components/global-search"), { ssr: false });
const SessionModal = dynamic(() => import("@/components/session-modal"), { ssr: false });

// In locations-client.tsx -- map loads only when toggled
const LocationMap = dynamic(() => import("@/components/location-map"), { ssr: false });
```

---

## File Naming Conventions

| Pattern | Meaning |
|---------|---------|
| `page.tsx` | Route segment (server component by default) |
| `loading.tsx` | Suspense fallback for the route |
| `error.tsx` | Error boundary (`"use client"` required) |
| `not-found.tsx` | 404 page for the segment |
| `layout.tsx` | Shared layout wrapping child routes |
| `*-actions.ts` | Server actions (`"use server"` at top) |
| `route.ts` | API route handler (GET, POST, etc.) |
| `*-client.tsx` | Client component paired with a server page |
| `*-form.tsx` | Form component |
| `*-modal.tsx` | Modal component |
| `*-button.tsx` | Interactive button with its own state |
| `*-widget.tsx` | Dashboard widget component |

---

## i18n

### useT() hook in client components

<!-- pattern: required useT() import path and call shape -->
```tsx
"use client";

import { useT } from "@/lib/i18n";

export default function LocationCard({ name, routeCount }: Props) {
  const t = useT();

  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{t("locations.routeCount", { count: routeCount })}</p>
    </div>
  );
}
```

### T component in server component trees

Server components can't use hooks. Use the `<T>` client component for translated strings:

<!-- pattern: required <T k="..." /> usage inside server components -->
```tsx
// In a server component or a component rendered inside one
import { T } from "@/lib/i18n/t-component";

export default function StatsSection() {
  return (
    <h2 className="text-xl font-bold text-vulkan-navy dark:text-gray-100">
      <T k="stats.title" />
    </h2>
  );
}
```

### Translation file structure

Keys use hierarchical dots. Both files must stay in sync.

<!-- example: substitute your own keys; hierarchical-dot key style and dual-file structure are canonical -->
```json
// src/lib/i18n/translations/nb.json
{
  "nav.home": "Hjem",
  "nav.locations": "Områder",
  "locations.title": "Klatreområder",
  "locations.routeCount": "{count} ruter",
  "form.save": "Lagre",
  "form.saving": "Lagrer...",
  "error.somethingWentWrong": "Noe gikk galt",
  "error.tryAgain": "Prøv igjen",
  "confirm.delete": "Slett",
  "confirm.cancel": "Avbryt"
}
```

<!-- example: substitute your own English translations matching the nb.json keys -->
```json
// src/lib/i18n/translations/en.json
{
  "nav.home": "Home",
  "nav.locations": "Locations",
  "locations.title": "Climbing locations",
  "locations.routeCount": "{count} routes",
  "form.save": "Save",
  "form.saving": "Saving...",
  "error.somethingWentWrong": "Something went wrong",
  "error.tryAgain": "Try again",
  "confirm.delete": "Delete",
  "confirm.cancel": "Cancel"
}
```

### Interpolation

<!-- pattern: required t() interpolation syntax (second-arg object with named tokens matching `{name}` in the value) -->
```ts
t("locations.routeCount", { count: 42 })  // "42 ruter" (nb) / "42 routes" (en)
```

### Rules

- Both `nb.json` and `en.json` must be complete before push
- Language stored in `localStorage` key `vulkan_language`
- Default locale is `nb` (Norwegian)
- Never hardcode user-visible strings -- always use translation keys

---

## Error Boundaries

### Route-level error.tsx

<!-- pattern: required error.tsx structure ("use client", { error, reset } props, retry button calling reset()) -->
```tsx
// src/app/(app)/error.tsx
"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useT } from "@/lib/i18n";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl mb-4">
        <ExclamationCircleIcon className="w-8 h-8 text-red-500" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-vulkan-navy dark:text-gray-100 mb-2">
        {t("error.somethingWentWrong")}
      </h2>
      <p className="text-neutral-500 dark:text-gray-400 mb-6 max-w-prose mx-auto text-sm">
        {error.message || t("error.unexpectedError")}
      </p>
      <button onClick={reset} className="btn-primary">
        {t("error.tryAgain")}
      </button>
    </div>
  );
}
```

### Pattern

- `error.tsx` must be a client component (`"use client"`)
- Red circle icon + heading + description + retry button
- Use `btn-primary` or `btn-secondary` for the retry button
- Place at `(app)/error.tsx` for app-wide fallback, and per-route for specific handling

---

## Anti-Patterns (Architecture)

| Anti-pattern | Correct approach |
|-------------|-----------------|
| `"use client"` at the top of every file | Only where needed -- server is the default |
| Client components fetching from APIs | Server components fetch, pass data as props |
| Duplicating display logic | Use shared `ui/` components |
| Missing `loading.tsx` on async routes | Add loading.tsx (re-export parent if same) |
| Missing `dark:` variants on new UI | Every visual element needs both modes |
| Skipping `revalidateTag` in actions | Always invalidate relevant cache tags after mutations |

For domain-specific anti-patterns:
- Performance & data — see [`nextjs-data.md#anti-patterns`](nextjs-data.md#anti-patterns)
- Auth (e.g. multiple `getUser()` calls) — see [`nextjs-auth.md#anti-patterns`](nextjs-auth.md#anti-patterns)
- Forms (e.g. `confirm()`/`alert()`) — see [`nextjs-forms.md#anti-patterns`](nextjs-forms.md#anti-patterns)
- Testing — see [`testing.md#anti-patterns`](testing.md#anti-patterns)

---

## Quick Reference: Supabase Client Selection

| Context | Client | Why |
|---------|--------|-----|
| Middleware | `createServerClient()` with `getClaims()` | Fast JWT check, no API call |
| Layout / page (auth) | `createClient()` from `server.ts` | Full user verification, RLS-scoped |
| Layout / page (shared data cache) | `createAdminClient()` via `unstable_cache` | Bypasses RLS for cacheable shared data |
| Server actions (admin ops) | `createAdminClient()` via `requireRole()` | Bypasses RLS, auth checked first |
| Server actions (user ops) | `createClient()` from `server.ts` | RLS protects user data |
| Client components | `createClient()` from `client.ts` | Browser-side, uses anon key |

---

## Where to go next

| Topic | File |
|-------|------|
| Middleware, `getCurrentUserWithProfile`, `requireRole`, login/signup flows | [`nextjs-auth.md`](nextjs-auth.md) |
| Server-component data fetching, parallel queries, `unstable_cache`, server actions | [`nextjs-data.md`](nextjs-data.md) |
| Forms (Zod, ErrorAlert, optimistic updates), modals, Cmd+K search | [`nextjs-forms.md`](nextjs-forms.md) |
| Vitest, RTL, Zod schema tests, Supabase mocks | [`testing.md`](testing.md) |
| Supabase RLS, schema, queries | [`supabase.md`](supabase.md) |
| Performance, caching strategy, region setup | [`performance.md`](performance.md) |
| Vercel deploy, env vars, domains | [`deploy.md`](deploy.md) |
| UI component classes (`.btn-primary`, `.card`, etc.) | `design/components.md` |
