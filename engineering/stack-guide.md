---
file: engineering/stack-guide.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-25
---

# Stack Guide — When to Use What

> **What this is:** Decision tree for picking the right framework + backend per project type.
> **When to read it:** Before starting a new project. Don't skip — getting this wrong costs weeks.
> **What it doesn't cover:** How to actually use each stack — see the per-stack docs in this folder.

This guide helps you pick the right technology for a Vulkan Engineering project.
Not every project needs a database, and not every website needs a framework.

---

## Decision Tree

<!-- example: stack decision tree (illustrative diagram) -->
```
Do you need user authentication?
├── YES → Do you need a database with user data?
│   ├── YES → Dynamic Web App (Next.js + Supabase + Vercel)
│   └── NO  → Authenticated Static (Next.js + Supabase Auth + Vercel)
└── NO  → Do you need a CMS for non-technical editors?
    ├── YES → Content Website (Astro + Sanity + Vercel)
    └── NO  → Is the content mostly static?
        ├── YES → Static Site (Astro or HTML + Vercel/GitHub Pages)
        └── NO  → Marketing/Landing Page (Astro + Vercel)
```

---

## Stack Profiles

### Dynamic Web App

For tools, dashboards, portals — anything with user accounts and data.

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 15 (App Router) | Server Components, streaming, file-based routing |
| Backend | Supabase | PostgreSQL, Auth, Storage, Row-Level Security, realtime |
| Hosting | Vercel | Zero-config Next.js deploy, preview per PR, edge network |
| Validation | Zod | Schema-first validation for forms and server actions |
| AI | Anthropic Claude API | When the app needs AI features |
| Testing | Vitest + React Testing Library | Fast, modern, good DX |
| Maps | Leaflet + react-leaflet | Free, no API key, OpenStreetMap tiles |
| Charts | Recharts | Composable, works with SSR |

**Example:** Book of Sends (climbing app) — auth, user profiles, leaderboard, session logging.

### Content Website

For company sites, blogs, documentation — content managed by non-developers.

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Astro | Partial hydration, fast by default, great for content |
| CMS | Sanity | Structured content, real-time preview, GROQ queries |
| Hosting | Vercel | Auto-deploy, CDN, preview deployments |
| Styling | Tailwind CSS + @vuleng/design-system | Brand consistency |

**Example:** vuleng.no — company website with editable content.

### Static Site

For landing pages, documentation, simple brochure sites.

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Astro or plain HTML/CSS | Minimal JS, fast loading |
| Hosting | Vercel or GitHub Pages | Free, simple |
| Styling | Tailwind CSS + @vuleng/design-system | Brand consistency |

**Example:** Project documentation site, event landing page.

---

## Technology Recommendations by Layer

### Frontend Framework
- **Next.js** — when you need auth, database, server-side logic, or API routes
- **Astro** — when content is primary, performance is critical, and interactivity is minimal
- **Plain HTML** — when the site is 1-5 static pages with no dynamic content

### Database
- **Supabase (PostgreSQL)** — recommended for all projects needing a database. Built-in auth, storage, RLS, realtime subscriptions. Generous free tier.
- Don't use a database if you don't need one. CMS content (Sanity) is not a database.

### Authentication
- **Supabase Auth** — email/password, magic link, OAuth. Works with RLS for row-level data access.
- Don't roll your own auth. Ever.

### CMS
- **Sanity** — for structured content managed by non-developers. GROQ for queries, real-time preview, image pipeline.
- Don't use a CMS for app data (user profiles, transactions). That's a database.

### Hosting
- **Vercel** — recommended for all web projects. Auto-deploy from GitHub, preview per PR, edge CDN, serverless functions.
- **GitHub Pages** — acceptable for pure static sites with no server logic.

### AI
- **Anthropic Claude API** — when the app needs AI features (content generation, analysis, extraction).
- Use the cheapest model that works (Haiku for speed, Sonnet for quality, Opus for complex reasoning).

### Styling
- **Tailwind CSS + @vuleng/design-system** — mandatory for all Vulkan projects. Provides brand tokens, component classes, dark mode.

### Validation
- **Zod** — for form validation, API input validation, and type inference. Schema-first approach.

### Testing
- **Vitest** — fast, ESM-native, good watch mode.
- **React Testing Library** — for component tests (behavior, not implementation).
- **Playwright** — for E2E tests if needed.

---

## What NOT to Use

- **Create React App** — dead project, use Next.js or Vite
- **Express/Koa** — use Next.js API routes or Supabase Edge Functions
- **MongoDB** — use PostgreSQL (Supabase)
- **Firebase** — use Supabase (open source, PostgreSQL, better DX)
- **WordPress** — use Sanity or Astro
- **jQuery** — it's 2026
- **CSS Modules / styled-components** — use Tailwind
- **Redux** — use server components + React context for simple state
