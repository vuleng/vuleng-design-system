---
file: engineering/nextjs-auth.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-26
---

# Next.js — Authentication & Authorization

> **What this is:** The four-layer auth pattern (middleware, cached helper, layout, server-action helpers) used by every Vulkan Next.js app on Supabase.
> **When to read it:** Before writing middleware, login/signup flows, role gating, server-action auth checks, or any code that calls `supabase.auth.*`.
> **What it doesn't cover:** Data fetching after auth (see [`nextjs-data.md`](nextjs-data.md)), form/login UI (see [`nextjs-forms.md`](nextjs-forms.md)), Supabase RLS specifics (see [`supabase.md`](supabase.md)), the Supabase client selection cheat sheet (see [`nextjs.md`](nextjs.md)).

## Table of Contents

- [Overview](#overview)
- [Layer 1: Middleware -- fast JWT validation](#layer-1-middleware----fast-jwt-validation)
- [Layer 2: Layout -- React.cache() wrapped auth](#layer-2-layout----reactcache-wrapped-auth)
- [Layer 3: Layout consumes the cached auth](#layer-3-layout-consumes-the-cached-auth)
- [Layer 4: Server action auth helpers](#layer-4-server-action-auth-helpers)
- [Rules](#rules)
- [Anti-Patterns](#anti-patterns)

---

## Overview

Auth uses a three-layer pattern: middleware for fast JWT checks, a cached helper for layout/page shared auth, and role guards for server actions.

---

## Layer 1: Middleware -- fast JWT validation

<!-- pattern: required middleware shape — must use getClaims() (local JWT, ~0ms) instead of getUser() (API call, ~200ms) -->
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

<!-- pattern: required edge middleware entry (filename, export name, matcher excludes) -->
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

---

## Layer 2: Layout -- React.cache() wrapped auth

<!-- pattern: required getCurrentUserWithProfile + requireApprovedRole signatures (React.cache, AuthorizationError, role gate) -->
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

---

## Layer 3: Layout consumes the cached auth

<!-- example: substitute your own layout structure and styling -->
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

---

## Layer 4: Server action auth helpers

<!-- pattern: required server-action auth helper signatures (requireRole / requireAdmin / requireEditorOrAdmin) -->
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

---

## Rules

- Middleware uses `getClaims()` (local JWT validation, ~0ms) -- never `getUser()` (~200ms API call)
- Layout and pages import `getCurrentUserWithProfile()` from `access.ts` -- never call `supabase.auth.getUser()` directly
- `React.cache()` deduplicates the auth call across layout and page within a single request
- Server actions use `requireRole()` / `requireAdmin()` / `requireEditorOrAdmin()` from `auth-helpers.ts`
- These auth helpers return the admin client, so actions can bypass RLS for trusted writes

---

## Anti-Patterns

| Anti-pattern | Correct approach |
|-------------|-----------------|
| Calling `getUser()` multiple times per request | Use `getCurrentUserWithProfile()` (React.cache) |
| Creating new `supabase.auth.getUser()` calls in pages | Import `getCurrentUserWithProfile()` from `access.ts` |
| Using `getUser()` in middleware (~200ms API call) | Use `getClaims()` for local JWT validation (~0ms) |

See also:
- [Server-action auth + the four-step mutation pattern](nextjs-data.md#server-actions)
- [Login / signup form patterns](nextjs-forms.md)
- [Supabase RLS policies](supabase.md)
