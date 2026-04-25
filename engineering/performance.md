---
file: engineering/performance.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-25
---

# Performance Best Practices

> **What this is:** Measured rules from real Vulkan projects — region co-location, auth dedup, caching, query discipline.
> **When to read it:** Before deploying any auth-gated app, before adding caching, when measuring slow pages.
> **What it doesn't cover:** UI animation perf (see `design/motion.md`).

Measured guidelines from real Vulkan projects. Every rule here was learned
by hitting a performance problem, measuring it, and fixing it.

---

## 1. Region Co-Location (Critical)

**Your server functions and database MUST be in the same region.**

This is the single most impactful performance decision. A region mismatch
adds ~150ms of network latency per database call. On a page with 5 queries,
that's 750ms of unnecessary waiting.

```json
// vercel.json — match your Supabase region
{
  "regions": ["dub1"]  // Dublin, if Supabase is in eu-west-1
}
```

| Supabase Region | Vercel Region | Latency |
|----------------|---------------|---------|
| eu-west-1 (Ireland) | dub1 (Dublin) | ~1-5ms |
| eu-west-1 (Ireland) | iad1 (US East) | ~150ms |
| us-east-1 (Virginia) | iad1 (US East) | ~1-5ms |

**Measured impact:** Auth calls dropped from ~300ms to ~60ms after fixing region mismatch.

---

## 2. Auth Deduplication

**Authentication should be verified once per request, not per component.**

### Problem
In a typical Next.js + Supabase setup, `getUser()` gets called in:
1. Middleware (~200ms API call)
2. Layout (~200ms API call)
3. Page (~200ms API call)

That's ~600ms just to confirm the user is logged in.

### Solution

**Middleware:** Use `getClaims()` for local JWT validation (~0ms):
```ts
// src/lib/supabase/middleware.ts
const { data: { claims } } = await supabase.auth.getClaims();
const user = claims?.sub ? { id: claims.sub } : null;
```

**Layout + Pages:** Use `React.cache()` so `getUser()` runs only once:
```ts
// src/lib/auth/access.ts
import { cache } from "react";

export const getCurrentUserWithProfile = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles").select("*").eq("id", user.id).maybeSingle();

  return { user, profile };
});
```

Layout and page both call `getCurrentUserWithProfile()` — the second
call returns the cached result instantly.

**Measured impact:** Auth time per page dropped from ~600ms to ~60ms.

---

## 3. Data Caching with Tags

**Cache shared data server-side. Fetch user-specific data fresh.**

### Shared data (locations, routes, sectors)
Wrap in `unstable_cache` with tag-based invalidation:

```ts
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const getCachedLocations = unstable_cache(
  async () => {
    const admin = createAdminClient();  // No cookie dependency
    const { data } = await admin.from("locations").select("id, name").order("name");
    return data ?? [];
  },
  ["locations-list"],
  { tags: ["locations"], revalidate: false },  // Infinite TTL
);
```

### Invalidate on mutation
```ts
// In server actions, after modifying data:
import { revalidateTag } from "next/cache";
revalidateTag("locations");
```

### User-specific data (ascents, favorites)
Always fetch fresh — can't use admin client:
```ts
const { data: favorites } = await supabase
  .from("user_favorites").select("entity_id").eq("user_id", user.id);
```

### Important: unstable_cache serializes as JSON
- Don't return `Set`, `Map`, `Date` — they become empty objects
- Return plain arrays/objects, convert in calling code

---

## 4. Query Discipline

### Use nested selects (avoid waterfalls)
```ts
// Bad: 2 sequential queries
const { data: routes } = await supabase.from("routes").select("id, sector_id");
const sectorIds = routes.map(r => r.sector_id);
const { data: sectors } = await supabase.from("sectors").select("id, name").in("id", sectorIds);

// Good: 1 query with nested join
const { data: routes } = await supabase
  .from("routes").select("id, sector:sectors(id, name)");
```

### Parallelize independent queries
```ts
const [{ data: locations }, { data: sectors }, { data: routes }] = await Promise.all([
  supabase.from("locations").select("id, name"),
  supabase.from("sectors").select("id, name, location_id"),
  supabase.from("routes").select("sector_id, grade").eq("active", true),
]);
```

### Select only needed columns on list pages
```ts
// Bad: fetches all 15+ columns for a list view
supabase.from("locations").select("*")

// Good: only what the card renders
supabase.from("locations").select("id, name, rock_type, latitude, longitude")
```

### Avoid N+1 loops
```ts
// Bad: 1 query per item in a loop
for (const date of dates) {
  const { data } = await supabase.from("sessions").select("id").eq("date", date);
}

// Good: batch query
const { data } = await supabase.from("sessions").select("id, date").in("date", dates);
```

---

## 5. Remove force-dynamic

**Don't add `export const dynamic = "force-dynamic"` to pages.**

Next.js auto-detects dynamic pages when they use `cookies()` or `headers()`.
The explicit directive prevents prefetch optimization and caching.

If you need a page to be dynamic (it almost always is when using Supabase),
just use `cookies()` via the Supabase client — Next.js handles the rest.

---

## 6. Lazy Load Heavy Libraries

```ts
// Don't import heavy libraries at the top level
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/location-map"), { ssr: false });
const ChartComponent = dynamic(() => import("@/components/weather-chart"), { ssr: false });
```

Good candidates for lazy loading:
- **Leaflet / react-leaflet** (~330KB)
- **Recharts** (~670KB)
- **Complex modals** (search palettes, session loggers)

---

## 7. Loading States

Every route should have a `loading.tsx` that provides instant visual feedback:

```tsx
// src/app/(app)/home/loading.tsx
export { default } from "../loading";  // Reuse shared skeleton
```

Use skeleton loaders (`.skeleton`, `.skeleton-text`) when the layout is known.
Use a spinner only when layout is unknown.

---

## Quick Checklist

- [ ] Vercel region matches Supabase region (`vercel.json`)
- [ ] Middleware uses `getClaims()`, not `getUser()`
- [ ] Auth wrapped in `React.cache()` — one `getUser()` per request
- [ ] Shared data uses `unstable_cache` + `revalidateTag`
- [ ] No `export const dynamic = "force-dynamic"` in pages
- [ ] Independent queries use `Promise.all`
- [ ] No `select("*")` on list pages
- [ ] No queries inside loops
- [ ] Heavy libraries lazy-loaded with `next/dynamic`
- [ ] Every route has a `loading.tsx`
