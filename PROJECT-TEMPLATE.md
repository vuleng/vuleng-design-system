# Project Template — Starting a New Vulkan App

Use this as a blueprint when starting a new project. Copy/adapt the
relevant sections into your project's `CLAUDE.md` and `docs/` folder.

---

## CLAUDE.md Template

Every Vulkan project should have a `CLAUDE.md` in the root that AI assistants
read before making changes. Adapt this template to your project:

```markdown
# CLAUDE.md — [Project Name]

This file gives AI assistants the design rules for this application.

---

## Project Documentation

| If you are working on... | Read... |
|--------------------------|---------|
| A page, route, or API endpoint | `docs/routes-and-pages.md` |
| Database tables, columns, RLS | `docs/database.md` |
| Auth, login, signup, roles | `docs/data-and-auth.md` |
| Tech stack, file structure, patterns | `docs/architecture.md` |
| A component's props or behavior | Read the component file directly |
| TypeScript types | Read `src/types/database.ts` directly |
| Translation keys | Read `src/lib/i18n/translations/nb.json` directly |
| Server action signatures | Read the relevant file in `src/app/actions/` |

### Before creating a feature branch:
- Always branch from the latest `origin/main`:
  `git fetch origin main && git checkout -b feat/my-feature origin/main`

### Before EVERY push — mandatory checklist:
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] Docs updated if you changed something documented in `docs/`
- [ ] Tests updated if you added/changed source files
- [ ] i18n complete — all new user-visible strings in BOTH `nb.json` and `en.json`
- [ ] Dark mode — all new UI elements have `dark:` variants

CRITICAL: Update docs in the SAME commit as the code change. Never batch.

---

## Design System: @vuleng/tailwind-preset

[Copy the design system rules from the preset's ai/CLAUDE.md]

---

## Shared UI Components

[List your project's shared components here — update as you build them]

---

## Supabase Query Patterns

Always use nested selects to avoid waterfall queries:
```ts
supabase.from("items")
  .select("*, category:categories(id, name)")
```

Always parallelize independent queries:
```ts
const [{ data: items }, { data: users }] = await Promise.all([
  supabase.from("items").select("id, name"),
  supabase.from("profiles").select("id, username"),
]);
```
```

---

## Documentation Structure

Every project should have a `docs/` folder with:

| File | Contents |
|------|----------|
| `architecture.md` | Tech stack, directory structure, env vars, key config, patterns |
| `database.md` | Tables, columns, constraints, RLS policies, functions, indexes |
| `routes-and-pages.md` | All routes with their purpose, data needs, components |
| `data-and-auth.md` | Auth flows, roles, middleware, protected routes |

### Rules for documentation:
- **Code wins.** If docs and code disagree, code is correct. Fix the docs.
- **Don't duplicate types.** Don't list component props — read the file.
- **Don't duplicate translations.** Don't list i18n keys — read the JSON.
- **Update in same commit.** Never "update docs later."

---

## File Naming Conventions

| Pattern | Meaning |
|---------|---------|
| `page.tsx` | Next.js route (server component by default) |
| `loading.tsx` | Suspense fallback skeleton |
| `error.tsx` | Error boundary |
| `layout.tsx` | Shared layout |
| `*-actions.ts` | Server actions (in `src/app/actions/`) |
| `route.ts` | API route handler |
| Components in `src/components/ui/` | Shared UI primitives |
| Components in `src/components/` | Shared complex components |
| Components colocated with page | Single-use page components |

---

## Environment Variables Template

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# AI (optional)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Project Directory Structure

```
project-name/
├── CLAUDE.md                        # AI instructions (this template)
├── vercel.json                      # Region config: {"regions": ["dub1"]}
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── routes-and-pages.md
│   └── data-and-auth.md
├── src/
│   ├── middleware.ts                # Auth guard (getClaims)
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, providers)
│   │   ├── page.tsx                # Landing / redirect
│   │   ├── globals.css             # Tailwind directives
│   │   ├── (app)/                  # Protected routes
│   │   │   ├── layout.tsx          # Auth layout (getCurrentUserWithProfile)
│   │   │   ├── loading.tsx         # Shared skeleton
│   │   │   ├── error.tsx           # Error boundary
│   │   │   ├── home/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── [other-routes]/
│   │   ├── (auth)/                 # Public auth routes
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── api/                    # API routes (if needed)
│   │   └── actions/                # Server actions
│   │       ├── auth-helpers.ts
│   │       ├── [domain]-actions.ts
│   │       └── ...
│   ├── components/
│   │   ├── ui/                     # Shared UI primitives
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-alert.tsx
│   │   │   └── spinner.tsx
│   │   ├── nav.tsx                 # Navigation
│   │   └── [feature]-form.tsx      # Shared forms
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts           # createClient (cookie-based)
│   │   │   ├── admin.ts            # createAdminClient (service role)
│   │   │   ├── client.ts           # Browser client
│   │   │   └── middleware.ts       # Session handler
│   │   ├── auth/
│   │   │   └── access.ts           # getCurrentUserWithProfile (React.cache)
│   │   ├── cache.ts                # unstable_cache wrappers
│   │   ├── i18n/
│   │   │   ├── index.tsx           # useT, useLanguage hooks
│   │   │   ├── providers.tsx       # I18nProvider
│   │   │   ├── t-component.tsx     # <T k="..." /> server component
│   │   │   └── translations/
│   │   │       ├── nb.json
│   │   │       └── en.json
│   │   ├── validation/
│   │   │   └── mutations.ts        # Zod schemas
│   │   ├── constants.ts            # App constants
│   │   └── utils.ts                # General utilities
│   ├── types/
│   │   └── database.ts             # Supabase types
│   └── __tests__/                  # Tests mirror src/ structure
│       ├── components/
│       ├── actions/
│       └── lib/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Testing Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
  },
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
});
```

### What to test:
- **Zod schemas** — valid/invalid payloads, edge cases, transforms
- **UI components** — rendering, interactions, accessibility
- **Utility functions** — pure logic (grade calculation, date formatting)
- **NOT server actions** — they need Next.js server context. Test schemas instead.
