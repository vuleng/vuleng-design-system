---
file: engineering/nextjs-forms.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-26
---

# Next.js — Forms, Modals & Search UI

> **What this is:** Client-side patterns for forms (Zod, error display, optimistic updates, button loading), modals (focus, escape, backdrop), and the Cmd+K command palette.
> **When to read it:** When building any form, confirmation dialog, modal, or search UI in a Vulkan Next.js app.
> **What it doesn't cover:** The server actions these UIs submit to (see [`nextjs-data.md`](nextjs-data.md)), auth checks for the actions (see [`nextjs-auth.md`](nextjs-auth.md)), `error.tsx` route-level error boundaries (see [`nextjs.md`](nextjs.md#error-boundaries)).

## Table of Contents

- [Forms](#forms)
  - [Zod schemas in lib/validation/](#zod-schemas-in-libvalidation)
  - [ErrorAlert for error display](#erroralert-for-error-display)
  - [Optimistic updates for toggles](#optimistic-updates-for-toggles)
  - [Button loading state](#button-loading-state)
- [Modals](#modals)
  - [Complete modal example](#complete-modal-example)
  - [Modal checklist](#modal-checklist)
- [Search (Cmd+K Pattern)](#search-cmdk-pattern)
  - [Architecture](#architecture)
  - [Key implementation details](#key-implementation-details)
  - [Opening from Nav](#opening-from-nav)
- [Anti-Patterns](#anti-patterns)

---

## Forms

### Zod schemas in lib/validation/

Define schemas centrally, import in both actions and tests.

<!-- example: substitute your own field schemas (the RequiredText/NullableText/NullablePositiveInt helpers are reusable preprocess wrappers) -->
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

<!-- pattern: required ErrorAlert component shape (role="alert", red token classes, both light and dark variants) -->
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

<!-- pattern: required ErrorAlert conditional-render shape -->
```tsx
{error && <ErrorAlert error={error} />}
```

### Optimistic updates for toggles

<!-- pattern: required optimistic-update flow (flip → server action → revert on failure) -->
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

<!-- pattern: required submit-button loading shape (Spinner + i18n keys + disabled) -->
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

## Modals

All modals follow the same structural pattern.

### Complete modal example

<!-- pattern: required modal structure (role="dialog" / aria-modal, Escape close, backdrop click, focus management, .card-floating panel) -->
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

## Search (Cmd+K Pattern)

### Architecture

<!-- example: substitute your own component tree and result categories -->
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

<!-- example: substitute your own search-result categories; the debounce/keyboard-nav/portal structure is the canonical command-palette skeleton -->
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

<!-- pattern: required Cmd/Ctrl+K global keyboard hook + dynamic-import lazy load -->
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

## Anti-Patterns

| Anti-pattern | Correct approach |
|-------------|-----------------|
| `confirm()` / `alert()` | Use `ConfirmModal` component |
| Hardcoded strings in UI | Use i18n keys: `t("locations.title")` |
| Inline Zod schemas in actions | Define in `lib/validation/mutations.ts` |

See also:
- [Server actions called by these forms — auth/validate/operate/invalidate pattern](nextjs-data.md#server-actions)
- [Auth-helper functions used at the top of action handlers](nextjs-auth.md#layer-4-server-action-auth-helpers)
- [Testing forms with React Testing Library + userEvent](testing.md#testing-components-with-rtl-and-userevent)
