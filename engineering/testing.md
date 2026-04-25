---
file: engineering/testing.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-25
---

# Testing

> **What this is:** The test discipline every Vulkan app follows.
> **When to read it:** When setting up a new app's test suite, or when adding tests to existing code.
> **What it doesn't cover:** End-to-end testing (Playwright) — defer to project-specific docs if needed.

## Stack

- **Vitest** — fast, ESM-native, Jest-compatible API.
- **React Testing Library** + `@testing-library/jest-dom` — component testing focused on user-visible behavior.
- **jsdom** — DOM environment for React components.
- **`@testing-library/user-event`** — realistic user interaction simulation.

`package.json` essentials:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/react": "^16.x",
    "@testing-library/user-event": "^14.x",
    "vitest": "^2.x",
    "jsdom": "^25.x"
  }
}
```

## Conventions

- Tests live in `src/__tests__/` mirroring the source structure (e.g. `src/components/foo.tsx` → `src/__tests__/components/foo.test.tsx`).
- One test file per source file; one `describe` per public export; multiple `it` per behavior.
- Test the user-visible behavior, not the implementation. Use queries like `getByRole`, `getByLabelText`, `getByText`. Avoid `getByTestId` unless nothing else works.
- Mock at the boundary: mock the Supabase client, not internal lib functions.

## Server Action Testing

**Server actions cannot be imported in Vitest.** They run in a Next.js server context that's not available to the test runner.

Workaround: extract the Zod schema and pure logic into a separate file, then test that:

```ts
// src/app/actions/create-route.ts
"use server";
import { createRouteSchema, validateBusinessRules } from "@/lib/validation/route";

export async function createRouteAction(formData: FormData) {
  const parsed = createRouteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.flatten() };
  const validation = validateBusinessRules(parsed.data);
  if (!validation.ok) return validation;
  // ... DB write
}

// src/lib/validation/route.ts
import { z } from "zod";
export const createRouteSchema = z.object({ /* ... */ });
export function validateBusinessRules(data: z.infer<typeof createRouteSchema>) { /* ... */ }
```

```ts
// src/__tests__/lib/validation/route.test.ts
import { createRouteSchema, validateBusinessRules } from "@/lib/validation/route";

it("rejects negative grade", () => {
  const r = createRouteSchema.safeParse({ grade: "-1" });
  expect(r.success).toBe(false);
});
```

## Pre-Push Discipline

Tests must be updated in the **same commit** as source changes. Never:
- Commit a new feature without tests.
- Rename/move a source file without renaming/moving its test.
- Delete a source file without deleting its test.
- Skip a failing test without filing a fix-up issue.

CI gates the push; local discipline keeps CI fast.

## Anti-Patterns

- ❌ Testing implementation details (state, refs, internal function calls). Test rendered output and user interaction.
- ❌ Snapshot tests for whole components. Use targeted assertions.
- ❌ Importing server actions or `next/headers` into Vitest — extract logic instead.
- ❌ `setTimeout` / `sleep` in tests. Use `await waitFor()` or `findBy*` queries.
- ❌ Reaching into a third-party component's internal DOM. Wrap it.
