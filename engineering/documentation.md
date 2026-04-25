---
file: engineering/documentation.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-25
---

# Living Documentation — Vulkan Engineering

> **What this is:** The living-doc standard — focused per-concern files in `docs/`, AI-readable, updated in the same commit as code.
> **When to read it:** When setting up a new project's `docs/`, or when deciding whether a code change requires a doc update.
> **What it doesn't cover:** This file (the design system's own docs). For meta-docs about this repo, see `CONTRIBUTING.md`.

Guidelines for project documentation that helps AI assistants work efficiently without drifting from the codebase.

---

## The Golden Rule

**Document what is HARD to derive from code.**
Do NOT duplicate TypeScript types, component props, or function signatures in markdown.

If a doc file just mirrors a source file, delete the doc — the code is the source of truth.

---

## Recommended `docs/` Structure

Every Vulkan project should have 3-5 focused doc files in `docs/`. Choose the files that match your project's complexity:

| File | Contains | Why it can't be read from code |
|------|----------|-------------------------------|
| `architecture.md` | Tech stack, directory tree, env vars, conventions | Scattered across config files |
| `database.md` | Current schema, RLS policies, triggers, migration history | Incremental SQL files don't show current state |
| `routes-and-pages.md` | Route table with file paths, role requirements, API specs | Roles and data flow not obvious from filenames |
| `data-and-auth.md` | Auth flows, middleware logic, data flow patterns, state | Spans multiple files and external services |

Not every project needs all four. A static Astro site might only need `architecture.md` and `content-model.md`.

---

## What Does NOT Need a Doc File

These are better read directly from source:

- Component props and behavior -> read the component file
- Type definitions -> read the types/interfaces file
- Mutation/action signatures -> read the action file
- Translation keys -> read the translation JSON files
- Constants, mappings, configuration -> read the source file

---

## CLAUDE.md Template

Every project must have a `CLAUDE.md` at the root. It should contain:

1. **Design system rules** — copied from `ai/CLAUDE.md` in this repo
2. **Project Documentation section** with a mapping table:
   - Rows pointing to `docs/` files for things that need docs
   - Rows saying "read [source file] directly" for things that don't
3. **After-task instructions** — update docs + tests in the same commit
4. **Standard requirements** — i18n and dark mode (unless explicitly exempt)

Example mapping table:

```markdown
| If you are working on... | Read... |
|--------------------------|---------|
| A page, route, or API endpoint | `docs/routes-and-pages.md` |
| Database schema or migrations | `docs/database.md` |
| Auth, roles, middleware | `docs/data-and-auth.md` |
| Tech stack, file structure | `docs/architecture.md` |
| A component's props | Read the component file directly |
| TypeScript types | Read the types file directly |
| Translation keys | Read the translation files directly |
```

---

## Rules

- Docs are updated in the **same commit** as the code change
- If a doc drifts from code, the **doc is wrong** — code always wins
- Never create docs for things TypeScript already describes
- Periodically review: if a doc section is never read, remove it

---

## Lessons Learned

These anti-patterns were discovered in production Vulkan projects:

### Docs that duplicate TypeScript drift immediately
We had 12 doc files mirroring component props and type definitions. Within weeks they were wrong — describing props that had been renamed and missing new ones. We cut to 4 files covering only what code can't express (auth flows, database schema, route-role mapping, architecture). The result: docs that stay accurate because they describe things that change rarely.

### God-files grow silently
A single server action file grew to 413 lines covering 6 unrelated domains (locations, routes, users, ascents, sectors, AI settings). AI had to scan the entire file to find one function. We split it into 7 domain-specific files averaging 60 lines each. The cost was near zero; the benefit compounds with every AI interaction.

### Single-use components in the shared folder confuse AI
Three components in `components/` were only used by one page each. AI treated them as shared and was cautious about changing them. Rule: if a component is used by only 1 page, colocate it with that page. The `components/` folder should contain genuinely shared code only.

### Dead code wastes AI context
An unused component (0 imports) sat in the codebase for months. AI considered it when planning changes, wasting tokens and creating confusion. Fix: grep for imports before assuming a file is shared; delete what's unused.

### Tests that don't follow UI changes are invisible bugs
Two UI components were redesigned but their tests weren't updated. The tests still passed because they tested DOM structure that no longer existed, with mocked data hiding the mismatch. Rule: tests are updated in the same commit as the code they cover.
