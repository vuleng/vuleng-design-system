---
fragment: standard-requirements
audience: [human, ai]
scope: process
stability: stable
last-verified: 2026-04-25
---

<!-- Single source of truth for the requirements every Vulkan Engineering
     application must satisfy. Included into engineering docs and AI plugin. -->

## Standard Application Requirements

Every Vulkan Engineering app must implement the following:

### 1. Internationalization
- Norwegian (default) and English.
- Use translation keys (no hard-coded user-visible strings).
- Persist user choice in `localStorage`.
- `<html lang="no">` for Norwegian, `<html lang="en">` for English.

### 2. Dark / Light Mode
- Class-based toggle: add/remove `.dark` on `<html>`.
- Persist user choice in `localStorage` key `vulkan_dark_mode`.
- Fall back to system `prefers-color-scheme` if no stored preference.
- All UI must have working dark-mode treatments.

### 3. Living Documentation
- Project must have a `docs/` folder following `engineering/documentation.md`.
- Update docs in the same commit as code changes — never batch.
- `CLAUDE.md` in project root for AI-rule context.

### 4. Test Discipline
- Tests live in a parallel structure to source (e.g. `src/__tests__/`).
- When adding, renaming, moving, or deleting source files, update tests in the same commit.
- Use Vitest + React Testing Library + jsdom for Next.js apps.

### 5. Pre-Push Checklist (mandatory)
Before every `git push`:
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] Docs updated for any changes documented in `docs/`
- [ ] All new user-visible strings have keys in BOTH locale files
- [ ] All new UI elements have `dark:` treatment

No exceptions.
