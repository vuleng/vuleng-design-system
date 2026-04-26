---
file: engineering/nextjs-data.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-26
---

# Next.js — Data Fetching, Server Actions & Caching

> **What this is:** How Vulkan apps read and write data — server-component fetches, parallel queries, nested Supabase selects, `unstable_cache` with tag invalidation, and the four-step server-action mutation pattern.
> **When to read it:** Before writing any page that loads data, any server action that mutates data, or any cache key/tag.
> **What it doesn't cover:** Auth checks layered on top of these fetches/actions (see [`nextjs-auth.md`](nextjs-auth.md)), form UI that calls actions (see [`nextjs-forms.md`](nextjs-forms.md)), Supabase RLS / schema (see [`supabase.md`](supabase.md)).

## Table of Contents

- [Data Fetching](#data-fetching)
  - [Server components fetch data](#server-components-fetch-data)
  - [Promise.all for parallel queries](#promiseall-for-parallel-queries)
  - [Nested Supabase selects to avoid waterfalls](#nested-supabase-selects-to-avoid-waterfalls)
  - [Select only needed columns](#select-only-needed-columns)
  - [unstable_cache + tags for shared data](#unstable_cache--tags-for-shared-data)
  - [revalidateTag in server actions](#revalidatetag-in-server-actions)
  - [When to use cached vs fresh queries](#when-to-use-cached-vs-fresh-queries)
- [Server Actions](#server-actions)
  - [File organization](#file-organization)
  - [Action structure: validate, auth, operate, invalidate](#action-structure-validate-auth-operate-invalidate)
  - [Error handling: try/catch + return { error?: string }](#error-handling-trycatch--return--error-string-)
  - [User-scoped operations](#user-scoped-operations)
- [Anti-Patterns](#anti-patterns)

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

## Anti-Patterns

### Performance

| Anti-pattern | Correct approach |
|-------------|-----------------|
| `export const dynamic = "force-dynamic"` on pages | Remove it; use `unstable_cache` for shared data |
| `select("*")` on list pages | Select only the columns you need |
| Queries inside loops (N+1) | Use `.in("id", ids)` or nested selects |
| Sequential independent queries | `Promise.all([query1, query2, query3])` |
| Fetching data in client components | Fetch in server components, pass as props |

### Mutations

| Anti-pattern | Correct approach |
|-------------|-----------------|
| Inline Zod schemas in actions | Define in `lib/validation/mutations.ts` |
| Giant monolithic action files | Split by domain: `location-actions.ts`, etc. |
| `useEffect` for data fetching | Fetch in server components |
| Skipping `revalidateTag` in actions | Always invalidate relevant cache tags after mutations |

See also:
- [Auth helpers used at the top of every action](nextjs-auth.md#layer-4-server-action-auth-helpers)
- [Form UI that calls these actions](nextjs-forms.md)
- [Schemas live in `lib/validation/`](nextjs-forms.md#zod-schemas-in-libvalidation)
- [Testing Zod schemas separately from actions](testing.md#server-action-testing)
