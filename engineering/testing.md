---
file: engineering/testing.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-26
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

<!-- pattern: required test scripts and devDependencies -->
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

### Test Layout

<!-- example: substitute your own test files; the src/__tests__/ structure mirroring src/ is canonical -->
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

## Server Action Testing

**Server actions cannot be imported in Vitest.** They run in a Next.js server context that's not available to the test runner.

Workaround: extract the Zod schema and pure logic into a separate file, then test that:

<!-- pattern: required server-action return-shape `{ ok: true, ... } | { ok: false, error }` -->
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

<!-- example: substitute your own schema and assertion -->
```ts
// src/__tests__/lib/validation/route.test.ts
import { createRouteSchema, validateBusinessRules } from "@/lib/validation/route";

it("rejects negative grade", () => {
  const r = createRouteSchema.safeParse({ grade: "-1" });
  expect(r.success).toBe(false);
});
```

### Worked Example: Zod Schema Tests

<!-- example: substitute your own schemas and assertions; the describe/it/safeParse + result.success guard is the canonical Zod-test shape -->
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

## Testing Components with RTL and userEvent

<!-- example: substitute your own component and behaviors; the render/userEvent/screen + getByRole/getByText queries are the canonical RTL shape -->
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

## Mocking Supabase

<!-- pattern: required Supabase mock shape (mock the boundary `@/lib/supabase/server` factory; chain mockReturnThis on .from().select().eq() builder methods; mockResolvedValue on terminals like .single()) -->
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
