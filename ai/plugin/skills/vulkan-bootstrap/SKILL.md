---
name: vulkan-bootstrap
description: Scaffold a new Vulkan Engineering project from scratch with the standard stack (Next.js + Supabase + Vercel + @vuleng/design-system) or generate the boilerplate for an existing project. Use this skill when the user wants to create a new app, set up a new repo, scaffold a project, bootstrap, initialize, or "start a new Vulkan project". Triggers include "lag et nytt prosjekt", "new app", "scaffold", "bootstrap", "start a new repo", "create a CLAUDE.md", "set up the docs folder", "initialize the project", "generate folder structure", "set up Tailwind v4 with Vulkan branding", "add @vuleng/design-system to my project". Also use when the user wants to add the standard /docs folder, the CLAUDE.md template, or the i18n / dark-mode / testing baseline to an existing project.
---

# Vulkan Bootstrap Skill

You are scaffolding a new Vulkan Engineering project, or adding the Vulkan baseline to an existing one.

## When this skill triggers

Read these files in order:

1. **Always:** `engineering/project-template.md` — the canonical bootstrap blueprint.
2. **Standard requirements (always):** `fragments/standard-requirements.md`.
3. **Stack pick (if not yet decided):** `engineering/stack-guide.md`.
4. **Doc layout:** `engineering/documentation.md`.
5. **AI rule for the new project:** include a generated `CLAUDE.md` (template below).

## Bootstrap Checklist

Walk through each step, asking the user for confirmation only when ambiguous:

### 1. Stack pick
Ask if not specified:
- **Next.js + Supabase + Vercel** — authenticated app, user data, real-time
- **Astro + Sanity + Vercel** — content site, marketing, public-only
- **Static HTML/CSS** — landing page, no logic

### 2. Repo init
```bash
git init
gh repo create vuleng/<name> --private
```

### 3. Framework scaffold (example: Next.js)
```bash
npx create-next-app@latest <name> --typescript --app --src-dir --import-alias "@/*" --tailwind=false
cd <name>
npm install -D tailwindcss@^4.0.0
npm install github:vuleng/vuleng-design-system#v2.0.0
```

### 4. CSS setup
```css
/* src/app/globals.css */
@import "@vuleng/design-system";

/* App-specific tokens (optional) */
@theme {
  --color-app-accent: <hex>;
}
```

For client-themed apps:
```css
@import "@vuleng/design-system/preset";
@import "./themes/<client>.css";
```

### 5. CLAUDE.md template
Create `CLAUDE.md` at project root with:

```md
# <Project Name>

This project follows the Vulkan Engineering design system v2.x. AI assistants:

- Use the `vulkan-ui` skill from the `vuleng-design` plugin for UI work.
- Use the `vulkan-stack` skill for backend / full-stack work.
- Use the `vulkan-bootstrap` skill (this one) only when scaffolding.

## Project Documentation

Focused docs in `docs/`. Read only what you need:

| Working on… | Read… |
|-------------|-------|
| A page, route, or API | `docs/routes-and-pages.md` |
| Database, columns, RLS | `docs/database.md` |
| Auth, login, roles | `docs/data-and-auth.md` |
| Tech stack, env vars | `docs/architecture.md` |

## Pre-Push Checklist

- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] Docs updated for any documented change
- [ ] i18n keys added in `nb.json` and `en.json`
- [ ] All new UI has dark-mode treatment

## Standard Requirements

This project implements:
1. Norwegian (default) + English i18n with localStorage persistence
2. Class-based dark mode with localStorage persistence
3. Living docs in `docs/`, updated in same commit as code
4. Test discipline (Vitest + RTL + jsdom, tests in `src/__tests__/`)
```

### 6. /docs scaffold
Create `docs/` with:
- `architecture.md` — tech stack, folder structure, env vars
- `routes-and-pages.md` — every route + purpose
- `database.md` — tables, columns, RLS (Supabase apps)
- `data-and-auth.md` — auth flows, role contracts (Supabase apps)

### 7. i18n baseline
Create `src/lib/i18n/translations/{nb,en}.json` with empty objects.
Create `src/lib/i18n.ts` with the `useT()` hook + locale provider.

### 8. Dark mode boot
Add to `src/app/layout.tsx`:
```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `(()=>{
      const stored = localStorage.getItem("vulkan_dark_mode");
      const sys = matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = stored !== null ? stored === "true" : sys;
      document.documentElement.classList.toggle("dark", dark);
    })()`,
  }}
/>
```

### 9. Test setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
Add `vitest.config.ts` and `src/__tests__/setup.ts` with `@testing-library/jest-dom` import.

### 10. First commit
```bash
git add -A && git commit -m "Initial Vulkan project scaffold"
git remote add origin git@github.com:vuleng/<name>.git
git push -u origin main
```

## Output Style

Generate files one at a time, show the user what's being created, and pause for confirmation before destructive actions (writing into existing files, deleting templates).

## Anti-Patterns

- ❌ Don't initialize a v3 Tailwind config — v2.0 of the design system is v4-native.
- ❌ Don't copy old `ai/CLAUDE.md` from v1.x of this repo — use the template above. The plugin replaces copy-paste.
- ❌ Don't skip i18n setup "for now" — retrofit is painful.
- ❌ Don't commit secrets. `.env.local` is for the developer; Vercel env vars are for prod.
