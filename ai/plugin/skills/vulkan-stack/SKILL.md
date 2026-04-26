---
name: vulkan-stack
description: Vulkan Engineering full-stack patterns — Next.js App Router, Supabase (DB + auth + RLS), performance discipline, Vercel deployment, testing with Vitest. Use this skill whenever working on backend logic, server actions, route handlers, auth flows, database queries, RLS policies, caching, deployment configuration, or test setup in a Vulkan project. Triggers include any mention of Next.js, App Router, server actions, server components, middleware, Supabase, RLS, postgres, auth, login, signup, role gating, view-as-role, Vercel, deploy, region co-location, edge functions, Vitest, React Testing Library, performance, caching, query optimization. Also trigger when user asks to "add an API route", "create a server action", "set up auth", "write a query", "deploy to Vercel", "fix slow page", "write tests".
---

# Vulkan Stack Skill

You are working on the back-end / full-stack side of a Vulkan Engineering app. The standard stack is Next.js 15+ App Router + Supabase + Vercel + Vitest.

## When this skill triggers

Read these files in order. Skip any that aren't relevant to the user's specific question — the Next.js playbook is split by topic so you only load what you need:

1. **Always orient:** `engineering/00-overview.md`.
2. **Stack-pick decisions:** `engineering/stack-guide.md`.
3. **Quick context (always pre-read):** `fragments/nextjs-essentials.md`.
4. **Next.js — overview, project structure, server vs client, loading & error boundaries, file naming, i18n, Supabase client cheat sheet:** `engineering/nextjs.md`.
5. **Next.js — auth (middleware, getClaims, role gating, server-action helpers):** `engineering/nextjs-auth.md`.
6. **Next.js — data fetching, server actions, `unstable_cache`, revalidation:** `engineering/nextjs-data.md`.
7. **Next.js — forms (Zod, ErrorAlert, optimistic updates), modals, Cmd+K search:** `engineering/nextjs-forms.md`.
8. **Supabase / DB / auth / RLS:** `engineering/supabase.md`.
9. **Performance, caching, region setup:** `engineering/performance.md`.
10. **Vercel deploy, env vars, domains:** `engineering/deploy.md`.
11. **Test setup, conventions, RTL, Zod schema tests:** `engineering/testing.md`.
12. **Astro + Sanity (only if working on a content site):** `engineering/astro-sanity.md`.

## Hard Rules

- Always use nested Supabase selects to avoid waterfall queries.
- Always parallelize independent queries with `Promise.all`.
- Never `.select("*")` on large tables (`ascents`, `routes`, etc.). Pick columns.
- Always validate server-action input with Zod inside the action.
- Use `getClaims()` in middleware, not `getUser()` (~0ms vs 50ms).
- For role-gated admin UIs: resolve effective role via `getEffectiveRole()` (server) / `useViewAsRole()` (client). Never use `profiles.role` directly except in the role switcher itself.
- Server actions cannot be imported into Vitest. Extract Zod schemas into a separate file and test those.
- Tests live in `src/__tests__/` mirroring source. Update tests in the same commit as source changes.
- Never push without `npm run build` and `npm test` passing.

## Output Style

When generating code:

- Server-component-first (no `useEffect` for initial data).
- Functions get TypeScript types; `any` is forbidden except at JSON boundaries.
- Server actions return `{ ok: true, data }` or `{ ok: false, error }` shape.
- Form handling uses `useActionState` + `useFormStatus` for progressive enhancement.
- Caching uses `unstable_cache` or `revalidateTag` — pick based on whether you need tag-based invalidation.

## Common Patterns

### Server action with Zod
<!-- pattern: required server-action return-shape `{ ok: true, data } | { ok: false, error }` and Zod-validate-first structure -->
```ts
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(1).max(120),
  grade: z.string().regex(/^[3-9][a-c][+-]?$/),
});

export async function createRoute(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.flatten() };

  const supabase = await createServerClient();
  const { data, error } = await supabase.from("routes").insert(parsed.data).select().single();
  if (error) return { ok: false, error: error.message };

  revalidatePath("/routes");
  return { ok: true, data };
}
```

### Nested select
<!-- example: substitute your own tables and join shape -->
```ts
const { data } = await supabase
  .from("ascents")
  .select(`
    id, ascended_at, style,
    route:routes(id, name, grade,
      sector:sectors(id, name,
        location:locations(id, name)
      )
    )
  `)
  .order("ascended_at", { ascending: false })
  .limit(20);
```

### Parallel independent queries
<!-- example: substitute your own tables -->
```ts
const [{ data: locations }, { data: sectors }, { data: routes }] = await Promise.all([
  supabase.from("locations").select("id, name"),
  supabase.from("sectors").select("id, name, location_id"),
  supabase.from("routes").select("id, sector_id, grade").eq("active", true),
]);
```

### Effective role check
<!-- pattern: required view-as-role contract — getEffectiveRole() server-side -->
```ts
import { getEffectiveRole } from "@/lib/auth/view-as-role-server";

export default async function AdminPage() {
  const realRole = await getRealRole();
  const effective = await getEffectiveRole(realRole);
  if (effective !== "admin" && effective !== "editor") redirect("/");
  // ...
}
```

## Anti-Patterns

- ❌ `useEffect` to fetch initial data on a server-renderable page → use a server component.
- ❌ Sequential queries that could parallelize → wrap in `Promise.all`.
- ❌ Trusting client form data without server-side Zod validation.
- ❌ Importing server actions into Vitest → extract pure logic.
- ❌ Skipping `npm run build` before push because "the dev server works."
