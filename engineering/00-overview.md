---
file: engineering/00-overview.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-26
---

# Engineering — Overview

> **What this is:** The engineering pillar of `@vuleng/design-system` — stack choices, framework patterns, deployment, testing, documentation discipline.
> **When to read it:** When starting a new app, when picking a framework, or when looking up a backend pattern.
> **What it doesn't cover:** UI / design (see `design/00-overview.md`).

## Click Path

| If you need to… | Read |
|------------------|------|
| Decide between Next.js, Astro+Sanity, or static | [`stack-guide.md`](stack-guide.md) |
| Orient in a Next.js app (App Router structure, server vs client, loading/error, file naming, i18n) | [`nextjs.md`](nextjs.md) |
| Wire up auth — middleware, `getClaims`, `getCurrentUserWithProfile`, role guards | [`nextjs-auth.md`](nextjs-auth.md) |
| Read or write data — server-component fetches, parallel queries, `unstable_cache`, server actions | [`nextjs-data.md`](nextjs-data.md) |
| Build forms, modals, or Cmd+K search | [`nextjs-forms.md`](nextjs-forms.md) |
| Build an Astro + Sanity site | [`astro-sanity.md`](astro-sanity.md) |
| Wire up Supabase (DB, RLS) | [`supabase.md`](supabase.md) |
| Hit the performance bar | [`performance.md`](performance.md) |
| Deploy to Vercel | [`deploy.md`](deploy.md) |
| Set up testing (Vitest + RTL) | [`testing.md`](testing.md) |
| Bootstrap a new project | [`project-template.md`](project-template.md) |
| Maintain living documentation | [`documentation.md`](documentation.md) |
| Diagnose a common failure | [`troubleshooting.md`](troubleshooting.md) |

## Standard Application Requirements

<!-- include: fragments/standard-requirements.md -->

## When to Skip This Folder

Building a static one-pager, a marketing site, or a customer-branded delivery that has its own engineering team? You can skip most of this and just consume the design system's CSS preset. The engineering folder is for full Vulkan-built apps.
