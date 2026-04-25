---
fragment: nextjs-essentials
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-25
---

<!-- Quick-reference summary of Next.js patterns. The full playbook is in
     engineering/nextjs.md — this fragment is what AI plugin skills load
     to give baseline context without reading 1400+ lines. -->

## Next.js (App Router) Essentials

### Folder structure
```
src/
├── app/                    # routes (App Router)
│   ├── (app)/              # authenticated route group
│   ├── (auth)/             # auth route group (login, signup)
│   ├── actions/            # server actions
│   └── api/                # route handlers
├── components/
│   └── ui/                 # shared UI components (use design system classes)
├── lib/
│   ├── supabase/           # supabase clients (server/client/admin)
│   ├── auth/               # auth helpers
│   └── i18n/               # translation setup + locales
└── types/                  # TypeScript types (database.ts auto-generated)
```

### Routing patterns
- Use route groups `(name)/` to share layouts without affecting URLs.
- `loading.tsx` for streaming; `error.tsx` for boundary; `not-found.tsx` for 404s.
- Dynamic segments: `[id]/page.tsx`. Catch-all: `[...slug]/page.tsx`.

### Data fetching
- Default: server components fetch directly from the database. No useEffect for initial data.
- Parallelize independent queries with `Promise.all`.
- Use nested selects in Supabase (`.select("*, route:routes(name, sector:sectors(name))")`) to avoid waterfall queries.
- Cache with `unstable_cache` for repeated computations or with `revalidateTag` for tag-based invalidation.

### Server actions
- Use `"use server"` directive at the top of action files.
- Validate input with Zod inside the action — never trust client.
- Return `{ ok: true, data }` or `{ ok: false, error }` shape.
- Call from client components via `<form action={action}>` or imperatively in `onClick` handlers.

### Auth pattern (Supabase + middleware)
- Middleware runs on every request: `middleware.ts` calls `supabase.auth.getClaims()` (~0ms vs `getUser()` 50ms).
- Protect routes by redirecting in middleware OR by gating in the layout.
- Use `getEffectiveRole(realRole)` server-side and `useViewAsRole()` client-side when implementing role-gated admin UIs (admin can preview as a lesser role via cookie).

### Forms
- Server actions for mutation; HTML form for progressive enhancement.
- Use `useActionState` for form state + pending/error handling.
- Show loading state via `useFormStatus` inside the submit button.

### Modals
- Render inline (no portals) within the page that opens them.
- Use `<dialog>` element OR a controlled component with `role="dialog" aria-modal="true"`.
- Trap focus, close on Escape, close on backdrop click.

### Search
- Debounce client-side input (300ms).
- Cache results with `unstable_cache` keyed on the query.
- Use a command palette (Cmd+K) for global search.

### Testing
- Server actions cannot be imported into Vitest — extract Zod schemas and test those separately.
- Use React Testing Library for components, mock Supabase via the client factory.

For full patterns including caching strategies, region co-location, RLS, and performance benchmarks, see `engineering/nextjs.md`, `engineering/supabase.md`, and `engineering/performance.md`.
