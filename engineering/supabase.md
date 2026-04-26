---
file: engineering/supabase.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-26
---

# Supabase — Database & Auth Patterns

> **What this is:** Patterns for using Supabase as the backend (DB, auth, RLS, storage).
> **When to read it:** When implementing any DB query, auth flow, or RLS policy.
> **What it doesn't cover:** Whether Supabase is even right for the project — see `stack-guide.md`.

Patterns for using Supabase as the backend for Vulkan Engineering apps.
These are general principles — not all apps need Supabase. See `stack-guide.md`.

---

## Two Clients, Two Purposes

| Client | When | RLS | Cookie |
|--------|------|-----|--------|
| `createClient()` | Server components, server actions that need user context | Enforced | Yes |
| `createAdminClient()` | Server actions that bypass RLS, cached queries | Bypassed | No |

<!-- pattern: required createClient() server-side signature -->
```ts
// src/lib/supabase/server.ts — user-aware, respects RLS
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), /* ... */ } }
  );
}
```

<!-- pattern: required createAdminClient() service-role signature -->
```ts
// src/lib/supabase/admin.ts — service role, no RLS
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

**Rule:** Use `createClient()` by default. Only use `createAdminClient()` when you
need to bypass RLS (admin operations, cached queries that serve all users).

---

## Authentication

### Middleware: `getClaims()` (fast, local)

Validates JWT signature locally against the project's public keys (~0ms).
Suitable for route protection — checking if a user is logged in.

<!-- pattern: required middleware uses getClaims (local JWT) not getUser (API call) -->
```ts
const { data: { claims } } = await supabase.auth.getClaims();
const user = claims?.sub ? { id: claims.sub } : null;

if (!user && !isPublicRoute) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

### Server Components: `getUser()` (secure, API call)

Verifies the token against Supabase Auth servers (~50-80ms in same region).
Use for actual user data access. Wrap in `React.cache()` to run once per request.

<!-- pattern: required getCurrentUserWithProfile() signature, React.cache-wrapped -->
```ts
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

### Server Actions: Direct `getUser()`

Server actions run as separate API calls — they don't share the React.cache()
scope with page renders. They must verify auth independently.

<!-- example: substitute your own action and entity -->
```ts
export async function deleteOrder(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  // ...
}
```

### Auth Helpers

Centralize role checks in a shared file:

<!-- pattern: required requireAdmin() auth-helper signature -->
```ts
// src/app/actions/auth-helpers.ts
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/home");

  return { admin, userId: user.id };
}
```

---

## Query Patterns

### Nested Selects (avoid waterfalls)

Supabase supports joining related tables in a single query:

<!-- example: substitute your own tables and join shape -->
```ts
// One query instead of three:
const { data } = await supabase
  .from("products")
  .select("id, name, tier, category:categories(id, name, vendor:vendors(id, name))")
  .eq("active", true);

// Access: product.category.vendor.name
```

**Important:** Supabase can return joined data as array or object depending on
the relationship. Use a helper to safely unwrap:

<!-- example: substitute your own joined relation -->
```ts
const category = Array.isArray(product.category) ? product.category[0] : product.category;
```

### Parallel Queries with Promise.all

Always parallelize independent queries:

<!-- example: substitute your own tables -->
```ts
const [{ data: vendors }, { data: categories }, { data: products }] = await Promise.all([
  supabase.from("vendors").select("id, name").order("name"),
  supabase.from("categories").select("id, name, vendor_id"),
  supabase.from("products").select("category_id, tier").eq("active", true),
]);
```

### Column Selection

On list pages, fetch only what the UI renders:

<!-- example: substitute your own table and column list -->
```ts
// List page — only card fields
supabase.from("vendors").select("id, name, type, region")

// Detail page — full object is fine
supabase.from("vendors").select("*").eq("id", id).single()
```

### Avoid N+1 Loops

<!-- example: substitute your own table and field -->
```ts
// BAD: N queries in a loop
for (const date of dates) {
  await supabase.from("events").select("id").eq("date", date);
}

// GOOD: Single batched query
const { data } = await supabase
  .from("events").select("id, date").in("date", dates);
```

---

## Caching Shared Data

Use `unstable_cache` with admin client for data all users see:

<!-- example: substitute your own table and cache key -->
```ts
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const getCachedVendors = unstable_cache(
  async () => {
    const admin = createAdminClient();  // No cookie = cacheable
    const { data } = await admin.from("vendors").select("id, name").order("name");
    return data ?? [];
  },
  ["vendors-list"],
  { tags: ["vendors"], revalidate: false },
);
```

**Why admin client?** `createClient()` reads cookies, which makes the function
request-specific and uncacheable. Admin client has no cookie dependency.

**Why `revalidate: false`?** Data changes infrequently. Invalidate explicitly
when it changes via `revalidateTag("vendors")` in server actions.

**JSON serialization caveat:** `unstable_cache` serializes return values as JSON.
Don't return `Set`, `Map`, or `Date` objects — they'll become `{}` or strings.

### Tag Convention

<!-- example: substitute your own tag names -->
```ts
export const CacheTags = {
  vendors: "vendors",
  products: "products",
  featured: "featured",
};
```

### Invalidation in Server Actions

<!-- example: substitute your own action and tag -->
```ts
import { revalidateTag } from "next/cache";

export async function createVendor(data) {
  // ... insert into database
  revalidateTag("vendors");  // All vendor caches invalidated instantly
}
```

---

## Row-Level Security (RLS)

Enable RLS on all tables. Define policies that restrict access by user:

<!-- pattern: required RLS policy structure (FOR <verb>, USING/WITH CHECK clauses) -->
```sql
-- Users can only read their own orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Public data** (vendors, products, categories) should have permissive SELECT policies.
**User data** (orders, favorites, events) should restrict to `auth.uid() = user_id`.

Admin operations use `createAdminClient()` which bypasses RLS entirely.

---

## Environment Variables

<!-- pattern: required Supabase env var names -->
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...          # Public, safe for client
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...               # Secret, server-only
```

- `NEXT_PUBLIC_*` vars are exposed to the browser — only put the anon key there.
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER be in client code.

---

## Database Types

Generate TypeScript types from your Supabase schema:

<!-- example: substitute your own project ID -->
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

Or maintain types manually for more control:

<!-- example: substitute your own table types -->
```ts
// src/types/database.ts
export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
}
```

---

## Quick Checklist

- [ ] RLS enabled on all tables
- [ ] `createClient()` for user-context queries
- [ ] `createAdminClient()` only for admin ops and cached queries
- [ ] Middleware uses `getClaims()`, not `getUser()`
- [ ] `getCurrentUserWithProfile()` wrapped in `React.cache()`
- [ ] Independent queries use `Promise.all`
- [ ] Related data uses nested selects, not sequential queries
- [ ] List pages use specific column selection
- [ ] Shared data cached with `unstable_cache` + tags
- [ ] Server actions call `revalidateTag()` after mutations
- [ ] Service role key is server-only (no `NEXT_PUBLIC_` prefix)
