---
file: engineering/nextjs.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-25
---

# Next.js App Router — Patterns & Conventions

> **What this is:** Comprehensive playbook for Vulkan apps on Next.js 15+ App Router with Supabase.
> **When to read it:** Before writing any auth, server action, data-fetching, form, or layout code.
> **What it doesn't cover:** UI component classes (see `design/components.md`), Supabase RLS specifics (see `supabase.md`), deployment (see `deploy.md`).
> **Quick reference:** `fragments/nextjs-essentials.md` is a 1-page summary for AI plugin context.

Playbook for AI agents and humans building Vulkan Engineering applications with Next.js 15+ App Router and Supabase.

## Table of Contents

- [Project Structure](#project-structure)
- [Server vs Client Components](#server-vs-client-components)
- [Authentication Flow](#authentication-flow)
- [Data Fetching](#data-fetching)
- [Server Actions](#server-actions)
- [Loading States](#loading-states)
- [Modals](#modals)
- [Forms](#forms)
- [Search (Cmd+K Pattern)](#search-cmdk-pattern)
- [Testing](#testing)
- [File Naming Conventions](#file-naming-conventions)
- [i18n](#i18n)
- [Error Boundaries](#error-boundaries)
- [Anti-Patterns](#anti-patterns)
- [Quick Reference: Supabase Client Selection](#quick-reference-supabase-client-selection)

---

## Project Structure

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

```
page.tsx (server)  -->  fetches data, auth check
  |
  v
some-client.tsx ("use client")  -->  search, filters, modals, etc.
```

---

## Authentication Flow

Auth uses a three-layer pattern: middleware for fast JWT checks, a cached helper for layout/page shared auth, and role guards for server actions.

### Layer 1: Middleware -- fast JWT validation

```ts
// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getClaims() validates JWT signature locally (~0ms)
  // instead of getUser() which calls Supabase Auth API (~200ms)
  const claimsResult = await supabase.auth.getClaims();
  const claims = claimsResult.data?.claims ?? null;
  const user = claims?.sub ? { id: claims.sub as string } : null;

  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = ["/login", "/signup", "/check-email", "/auth/callback"];
  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

```ts
// src/middleware.ts -- edge middleware entry
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Layer 2: Layout -- React.cache() wrapped auth

```ts
// src/lib/auth/access.ts
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

/**
 * Get current user + profile. Wrapped in React.cache() so it runs only
 * ONCE per request -- layout and page share the same result.
 */
export const getCurrentUserWithProfile = cache(async (): Promise<{
  user: User | null;
  profile: Profile | null;
}> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, username, approved, role, created_at, last_seen_changelog")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: profile ?? null };
});

export async function requireApprovedRole(...roles: UserRole[]) {
  const { user, profile } = await getCurrentUserWithProfile();
  if (!user) throw new AuthorizationError(401, "Unauthorized");
  if (!profile || !profile.approved) throw new AuthorizationError(403, "Forbidden");
  if (roles.length > 0 && !roles.includes(profile.role)) {
    throw new AuthorizationError(403, "Forbidden");
  }
  return { user, profile };
}
```

### Layer 3: Layout consumes the cached auth

```tsx
// src/app/(app)/layout.tsx
import { redirect } from "next/navigation";
import { getCurrentUserWithProfile } from "@/lib/auth/access";
import Nav from "@/components/nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getCurrentUserWithProfile();
  if (!user) redirect("/login");
  if (!profile || !profile.approved) redirect("/pending-approval");

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-dark-bg">
      <Nav profile={profile} />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
```

### Layer 4: Server action auth helpers

```ts
// src/app/actions/auth-helpers.ts
"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/database";

export async function requireRole(...allowedRoles: UserRole[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role as UserRole)) redirect("/home");
  return { admin, userId: user.id, role: profile.role as UserRole };
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function requireEditorOrAdmin() {
  return requireRole("admin", "editor");
}
```

### Rules

- Middleware uses `getClaims()` (local JWT validation, ~0ms) -- never `getUser()` (~200ms API call)
- Layout and pages import `getCurrentUserWithProfile()` from `access.ts` -- never call `supabase.auth.getUser()` directly
- `React.cache()` deduplicates the auth call across layout and page within a single request
- Server actions use `requireRole()` / `requireAdmin()` / `requireEditorOrAdmin()` from `auth-helpers.ts`
- These auth helpers return the admin client, so actions can bypass RLS for trusted writes

---

## Data Fetching

### Server components fetch data

Pages are async server components. They fetch data, compute derived state, and pass plain objects to client components.

```tsx
export default async function LocationsPage() {
  const { user } = await getCurrentUserWithProfile();
  if (!user) redirect("/login");

  const supabase = await createClient();

  // Shared (cached) + user-specific (fresh) in parallel
  const [locations, sectors, routes, { data: favorites }] = await Promise.all([
    getCachedLocationsList(),          // cached, shared
    getCachedSectors(),                // cached, shared
    getCachedRouteGrades(),            // cached, shared
    supabase.from("user_favorites")    // fresh, user-specific
      .select("entity_id")
      .eq("user_id", user.id)
      .eq("entity_type", "location"),
  ]);

  // Compute Maps and aggregations on the server
  const sectorToLocation = new Map<string, string>();
  for (const s of sectors) {
    if (s.location_id) sectorToLocation.set(s.id, s.location_id);
  }

  return <LocationsClient locations={enriched} />;
}
```

### Promise.all for parallel queries

Never await sequential independent queries. Always parallelize with `Promise.all`.

```ts
// GOOD: parallel -- total time = max(query1, query2, query3)
const [locations, sectors, routes] = await Promise.all([
  getCachedLocationsList(),
  getCachedSectors(),
  getCachedRouteGrades(),
]);

// BAD: sequential -- total time = query1 + query2 + query3
const locations = await getCachedLocationsList();
const sectors = await getCachedSectors();
const routes = await getCachedRouteGrades();
```

### Nested Supabase selects to avoid waterfalls

Use Supabase's nested select syntax to fetch related data in one roundtrip.

```ts
// GOOD: one query with nested joins
const { data } = await admin
  .from("routes")
  .select("*, sector:sectors(*, location:locations(*))")
  .eq("id", routeId)
  .single();

// BAD: three sequential queries (waterfall)
const route = await admin.from("routes").select("*").eq("id", routeId).single();
const sector = await admin.from("sectors").select("*").eq("id", route.sector_id).single();
const location = await admin.from("locations").select("*").eq("id", sector.location_id).single();
```

### Select only needed columns

```ts
// GOOD: lightweight columns for list pages
const { data } = await admin
  .from("locations")
  .select("id, name, latitude, longitude, rock_type, area_description")
  .order("name");

// BAD: fetching everything
const { data } = await admin.from("locations").select("*").order("name");
```

### unstable_cache + tags for shared data

Shared (non-user-specific) data uses `unstable_cache` with tag-based invalidation. The Data Cache persists across requests until a tag is invalidated.

```ts
// src/lib/cache.ts
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// Tag convention: "entity" for lists, "entity:{id}" for details
export const CacheTags = {
  locations: "locations",
  location: (id: string) => `location:${id}`,
  sector: (id: string) => `sector:${id}`,
  route: (id: string) => `route:${id}`,
  routes: "routes",
  leaderboard: "leaderboard",
} as const;

/** All locations for list page. Cached globally. */
export const getCachedLocationsList = unstable_cache(
  async () => {
    const admin = createAdminClient();
    const { data } = await admin
      .from("locations")
      .select("id, name, latitude, longitude, rock_type, dries_speed, area_description")
      .order("name");
    return data ?? [];
  },
  ["locations-list"],       // cache key
  { tags: [CacheTags.locations], revalidate: false },  // infinite TTL, tag-invalidated
);

/** Single route with joins. */
export const getCachedRoute = unstable_cache(
  async (routeId: string) => {
    const admin = createAdminClient();
    const { data } = await admin
      .from("routes")
      .select("*, sector:sectors(*, location:locations(*))")
      .eq("id", routeId)
      .single();
    return data;
  },
  ["route-detail"],
  { tags: [CacheTags.routes], revalidate: false },
);
```

### revalidateTag in server actions

When a mutation changes data, invalidate the relevant cache tags.

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CacheTags } from "@/lib/cache";

export async function createLocation(formData: FormData) {
  const { admin } = await requireEditorOrAdmin();
  // ... validate + insert ...

  revalidateTag(CacheTags.locations);  // invalidates all location caches
  revalidatePath("/admin");            // revalidates the admin page
}
```

### When to use cached vs fresh queries

| Data type | Strategy |
|-----------|----------|
| Locations, sectors, routes (shared, read-heavy) | `unstable_cache` with tags |
| User favorites, ascents, sessions (per-user) | Fresh Supabase query |
| Leaderboard aggregations (shared, expensive) | `unstable_cache` with tag |
| Admin lists | `unstable_cache` with tags |

---

## Server Actions

### File organization

Split by domain entity. Each file has `"use server"` at the top.

```
src/app/actions/
  auth-helpers.ts           # requireRole, requireAdmin, requireEditorOrAdmin
  location-actions.ts       # createLocation, updateLocation, deleteLocation
  route-actions.ts          # createRoute, updateRoute, deleteRoute
  sector-actions.ts         # createSector, updateSector, deleteSector
  ascent-actions.ts         # deleteAscent, updateAscent, deleteOwnAscent
  session-actions.ts        # createSession, deleteSession
  log-actions.ts            # fetchUserLogPage (read-only server action)
  search-actions.ts         # globalSearch
  dashboard-actions.ts      # toggleFavorite, updateDashboardLayout
  ai-actions.ts             # AI-powered features
```

### Action structure: validate, auth, operate, invalidate

Every mutation follows the same four-step pattern:

```ts
// src/app/actions/route-actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CacheTags } from "@/lib/cache";
import { IdSchema, RouteCreateSchema } from "@/lib/validation/mutations";
import { requireEditorOrAdmin } from "./auth-helpers";

export async function createRoute(data: {
  name: string;
  grade: string;
  type: string;
  description?: string | null;
  sector_id?: string | null;
  pitches?: { pitch_number: number; grade: string }[];
}) {
  // 1. Auth -- redirects to /login or /home if unauthorized
  const { admin } = await requireEditorOrAdmin();

  // 2. Validate -- Zod schema from lib/validation/
  const { pitches, ...routeData } = data;
  const parsed = RouteCreateSchema.safeParse(routeData);
  if (!parsed.success) throw new Error("Invalid route data");

  // 3. Operate -- use admin client (bypasses RLS)
  const { data: newRoute, error } = await admin
    .from("routes")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error || !newRoute) throw new Error(error?.message ?? "Failed to create route");

  // Insert related data
  if (pitches && pitches.length > 0) {
    const pitchRows = pitches.map((p) => ({
      route_id: newRoute.id,
      pitch_number: p.pitch_number,
      grade: p.grade,
    }));
    await admin.from("route_pitches").insert(pitchRows);
  }

  // 4. Invalidate -- clear caches + revalidate paths
  revalidateTag(CacheTags.routes);
  revalidatePath("/admin");
  revalidatePath("/routes");

  return newRoute.id;
}
```

### Error handling: try/catch + return { error?: string }

For actions called from client components that need to display errors in the UI:

```ts
export async function updateLocationMetadataJson(
  id: string,
  data: Record<string, unknown>,
): Promise<{ error?: string }> {
  try {
    const { admin } = await requireEditorOrAdmin();

    const idParsed = IdSchema.safeParse(id);
    if (!idParsed.success) return { error: "Invalid location ID" };

    const parsed = LocationMetadataSchema.safeParse(data);
    if (!parsed.success) {
      return { error: `Invalid data: ${parsed.error.issues.map((i) => i.message).join(", ")}` };
    }

    const { error } = await admin.from("locations").update(parsed.data).eq("id", idParsed.data);
    if (error) return { error: error.message };

    revalidateTag(CacheTags.locations);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
```

Client-side consumption:

```tsx
const result = await updateLocationMetadataJson(locationId, formData);
if (result.error) {
  setError(result.error);   // display in ErrorAlert
} else {
  router.refresh();
}
```

### User-scoped operations

For actions where the user modifies their own data, use `createClient()` (RLS-protected) instead of the admin client:

```ts
export async function deleteOwnAscent(ascentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = z.string().uuid().safeParse(ascentId);
  if (!id.success) throw new Error("Invalid ascent ID");

  // RLS ensures user can only delete their own ascents
  const { error } = await supabase
    .from("ascents")
    .delete()
    .eq("id", id.data)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/users/${user.id}`);
}
```

---

## Loading States

### loading.tsx per route

Every route segment with async data should have a `loading.tsx`. Next.js wraps the page in a `<Suspense>` boundary using this file as the fallback.

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

```tsx
// src/app/(app)/locations/[id]/loading.tsx
export { default } from "../../loading";
```

### Skeleton loaders for known layouts

When you know the page structure, use `.skeleton` classes instead of spinners:

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

```tsx
// In nav.tsx -- these render only when opened
const GlobalSearch = dynamic(() => import("@/components/global-search"), { ssr: false });
const SessionModal = dynamic(() => import("@/components/session-modal"), { ssr: false });

// In locations-client.tsx -- map loads only when toggled
const LocationMap = dynamic(() => import("@/components/location-map"), { ssr: false });
```

---

## Modals

All modals follow the same structural pattern.

### Complete modal example

```tsx
"use client";

import { useRef, useEffect } from "react";
import { useT } from "@/lib/i18n";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const t = useT();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus management: focus first safe action on open
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop: click outside to close */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="card-floating relative p-6 max-w-sm w-full"
      >
        <h3 className="text-lg font-bold text-vulkan-navy dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-gray-400 mb-6">
          {description}
        </p>
        <div className="flex gap-3 justify-end">
          <button ref={cancelRef} onClick={onCancel} className="btn-secondary">
            {t("confirm.cancel")}
          </button>
          <button onClick={onConfirm} className="btn-danger">
            {confirmLabel ?? t("confirm.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Modal checklist

- [ ] `role="dialog"` and `aria-modal="true"` on the panel
- [ ] Backdrop: `bg-black/60 backdrop-blur-sm`
- [ ] Panel: `card-floating` class
- [ ] Escape key calls `onCancel`
- [ ] Click on backdrop calls `onCancel`
- [ ] Focus management: focus a safe action (cancel button) on open
- [ ] Renders `null` when `open` is false
- [ ] Body scroll lock for full-screen modals (use `overflow-hidden` on body)
- [ ] For portals: use `createPortal(jsx, document.body)` when the modal needs to escape overflow containers

---

## Forms

### Zod schemas in lib/validation/

Define schemas centrally, import in both actions and tests.

```ts
// src/lib/validation/mutations.ts
import { z } from "zod";

// Reusable field helpers
const RequiredText = (max: number) => z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().min(1).max(max),
);

const NullableText = (max: number) => z.preprocess(
  (value) => {
    if (value == null) return null;
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  },
  z.string().max(max).nullable(),
);

const NullablePositiveInt = (max: number) => z.preprocess(
  (value) => (value == null || value === "" ? null : Number(value)),
  z.number().int().positive().max(max).nullable(),
);

export const RouteCreateSchema = z.object({
  name: RequiredText(200),
  grade: RequiredText(50),
  type: z.enum(["boulder", "sport", "trad"]),
  description: NullableText(2000),
  setter: NullableText(200),
  sector_id: z.preprocess(emptyStringToNull, z.string().uuid().nullable()),
  length: NullablePositiveInt(1000),
  star_rating: z.preprocess(numberOrNull, z.number().int().min(1).max(3).nullable()),
});

export const IdSchema = z.string().uuid();
```

### ErrorAlert for error display

```tsx
// src/components/ui/error-alert.tsx
export function ErrorAlert({ error }: { error: string }) {
  return (
    <p
      role="alert"
      className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20
                 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3"
    >
      {error}
    </p>
  );
}
```

Usage in a form:

```tsx
{error && <ErrorAlert error={error} />}
```

### Optimistic updates for toggles

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleFavorite } from "@/app/actions/dashboard-actions";

export default function FavoriteToggle({ entityType, entityId, isFavorite }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [optimistic, setOptimistic] = useState(isFavorite);

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    setOptimistic(!optimistic);  // optimistic flip
    try {
      await toggleFavorite(entityType, entityId);
      router.refresh();
    } catch {
      setOptimistic(optimistic);  // revert on failure
    } finally {
      setLoading(false);
    }
  }

  // render heart icon based on `optimistic`, not `isFavorite`
}
```

### Button loading state

```tsx
<button
  type="submit"
  disabled={loading}
  className="btn-primary flex items-center gap-2"
>
  {loading && <Spinner />}
  {loading ? t("form.saving") : t("form.save")}
</button>
```

---

## Search (Cmd+K Pattern)

### Architecture

```
Nav ("use client")
  |-- GlobalSearch (lazy via next/dynamic, ssr: false)
        |-- Meta+K keyboard shortcut
        |-- Debounced input (250ms)
        |-- Server action: globalSearch()
        |-- Grouped results by category
        |-- Keyboard nav (arrows + Enter)
```

### Key implementation details

```tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { globalSearch, type SearchResult } from "@/app/actions/search-actions";

export default function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Debounced search (250ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await globalSearch(query);
        setResults(data);
        setSelectedIndex(0);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Group results by category
  const grouped = CATEGORY_ORDER.reduce<Record<Category, SearchResult[]>>((acc, cat) => {
    acc[cat] = results.filter((r) => r.type === cat);
    return acc;
  }, { route: [], location: [], sector: [], user: [] });

  // Flat list for keyboard nav
  const flat = CATEGORY_ORDER.flatMap((cat) => grouped[cat]);

  // Handle keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[selectedIndex]) {
      router.push(flat[selectedIndex].href);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  // Render via portal to escape stacking contexts
  return createPortal(/* modal markup */, document.body);
}
```

### Opening from Nav

```tsx
// In nav.tsx
const [searchOpen, setSearchOpen] = useState(false);

// Global keyboard shortcut
useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(true);
    }
  }
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}, []);

// Lazy-loaded
const GlobalSearch = dynamic(() => import("@/components/global-search"), { ssr: false });

// In JSX
{searchOpen && <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />}
```

---

## Testing

### Setup: Vitest + React Testing Library + jsdom

Tests live in `src/__tests__/`, mirroring the source structure.

```
src/__tests__/
  actions/
    action-schemas.test.ts     # Zod schema validation
  components/
    ui/
      grade-badge.test.tsx     # UI primitives
    confirm-modal.test.tsx     # Modal behavior
    route-form.test.tsx        # Form components
  lib/
    access.test.ts             # Auth helpers
    utils.test.ts              # Utility functions
```

### Testing Zod schemas (server actions can't be imported)

Server actions use Next.js server context (`"use server"`, `cookies()`, etc.) which Vitest can't provide. Test the Zod schemas separately:

```ts
// src/__tests__/actions/action-schemas.test.ts
import { describe, expect, it } from "vitest";
import { RouteCreateSchema, IdSchema } from "@/lib/validation/mutations";

describe("RouteCreateSchema", () => {
  it("accepts a valid route payload", () => {
    const result = RouteCreateSchema.safeParse({
      name: "  Apegutt  ",
      grade: " 6+ ",
      type: "sport",
      description: "  Nice movement  ",
      sector_id: "123e4567-e89b-12d3-a456-426614174000",
      length: "25",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Apegutt");   // trimmed
      expect(result.data.length).toBe(25);          // coerced to number
    }
  });

  it("normalizes blank optional values to null", () => {
    const result = RouteCreateSchema.safeParse({
      name: "Test",
      grade: "6a",
      type: "boulder",
      description: "",
      setter: "",
      length: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeNull();
      expect(result.data.length).toBeNull();
    }
  });
});
```

### Testing components with RTL and userEvent

```tsx
// src/__tests__/components/confirm-modal.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "@/components/confirm-modal";

describe("ConfirmModal", () => {
  const defaultProps = {
    open: true,
    title: "Delete route",
    description: "Are you sure?",
    confirmLabel: "Delete",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it("renders nothing when open is false", () => {
    const { container } = render(<ConfirmModal {...defaultProps} open={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);
    await user.click(screen.getByText("Delete"));
    expect(defaultProps.onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel on Escape key", async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);
    await user.keyboard("{Escape}");
    expect(defaultProps.onCancel).toHaveBeenCalledOnce();
  });

  it("has dialog role with aria-modal", () => {
    render(<ConfirmModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});
```

### Mocking Supabase

```ts
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
    },
  })),
}));
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

## Anti-Patterns

### Performance

| Anti-pattern | Correct approach |
|-------------|-----------------|
| `export const dynamic = "force-dynamic"` on pages | Remove it; use `unstable_cache` for shared data |
| Calling `getUser()` multiple times per request | Use `getCurrentUserWithProfile()` (React.cache) |
| `select("*")` on list pages | Select only the columns you need |
| Queries inside loops (N+1) | Use `.in("id", ids)` or nested selects |
| Sequential independent queries | `Promise.all([query1, query2, query3])` |
| Fetching data in client components | Fetch in server components, pass as props |

### Code quality

| Anti-pattern | Correct approach |
|-------------|-----------------|
| Hardcoded strings in UI | Use i18n keys: `t("locations.title")` |
| `gray-*` in light mode | Use `neutral-*` (navy-tinted) |
| `confirm()` / `alert()` | Use `ConfirmModal` component |
| Inline Zod schemas in actions | Define in `lib/validation/mutations.ts` |
| Giant monolithic action files | Split by domain: `location-actions.ts`, etc. |
| Importing server actions in tests | Test the Zod schemas separately |
| `useEffect` for data fetching | Fetch in server components |
| Creating new `supabase.auth.getUser()` calls in pages | Import `getCurrentUserWithProfile()` from `access.ts` |

### Architecture

| Anti-pattern | Correct approach |
|-------------|-----------------|
| `"use client"` at the top of every file | Only where needed -- server is the default |
| Client components fetching from APIs | Server components fetch, pass data as props |
| Duplicating display logic | Use shared `ui/` components |
| Missing `loading.tsx` on async routes | Add loading.tsx (re-export parent if same) |
| Missing `dark:` variants on new UI | Every visual element needs both modes |
| Skipping `revalidateTag` in actions | Always invalidate relevant cache tags after mutations |

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
