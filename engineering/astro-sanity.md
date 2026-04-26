---
file: engineering/astro-sanity.md
audience: [human, ai]
scope: engineering
stability: draft
last-verified: 2026-04-25
---

# Astro + Sanity

> **What this is:** The stack profile for Vulkan content/marketing sites: Astro for the front-end, Sanity Studio for the CMS.
> **When to read it:** When building a content-driven site that's not an authenticated app — marketing pages, case studies, product catalogs, knowledge bases.
> **What it doesn't cover:** Authenticated apps (use Next.js + Supabase — see `nextjs.md`).

## When to Use Astro + Sanity

| Use Astro + Sanity | Use Next.js + Supabase |
|--------------------|------------------------|
| Content authored by editors in a CMS | Data created/owned by users |
| Mostly static pages, infrequent updates | Frequent writes, real-time data |
| SEO-critical, ISR-style rebuild on publish | Per-user dashboards, auth-gated UI |
| Public site, no login | App with sign-up / login |

If the site has both: Astro for the public side, Next.js for the app side, on different subdomains.

## Stack Snapshot

| Layer | Choice |
|-------|--------|
| Front-end framework | Astro 5.x |
| CMS | Sanity v3 (Studio embedded or hosted at `/studio`) |
| Styling | `@vuleng/design-system` (CSS preset + theme) |
| Hosting | Vercel (Astro static + on-demand revalidation) |
| Image optimization | Sanity image pipeline + Astro `<Image>` |
| Forms | Form actions to Vercel functions or to Sanity webhooks |

## Project Layout

<!-- example: Astro+Sanity blueprint — adapt to your content model -->
```
src/
├── pages/                  # Astro routes
│   ├── index.astro
│   ├── projects/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── studio/             # embedded Sanity Studio
│       └── [...path].astro
├── components/
│   ├── ui/                 # shared (uses design system classes)
│   └── content/            # Sanity-data-driven blocks
├── lib/
│   ├── sanity/
│   │   ├── client.ts       # GROQ client
│   │   ├── queries.ts
│   │   └── schemas/        # Sanity schema definitions
│   └── i18n/
└── styles/
    └── global.css          # @import "@vuleng/design-system";
```

## Patterns

### Fetching content
- Use GROQ with cached queries via the Sanity client. Astro's static rendering means most queries run at build time.
- For preview/draft mode, use `previewClient` with `useCdn: false`.

### On-publish rebuild
- Sanity webhook → Vercel deploy hook. Triggers a fresh build when content changes.
- For high-traffic sites, prefer ISR (Incremental Static Regeneration) over full rebuild.

### Norwegian / English
- Sanity field-level i18n: each translatable field is an object with `no` and `en` keys.
- Astro renders the right language based on the route prefix (`/no/` vs `/en/`).
- Default route is Norwegian; `/en/` for English.

### Design system integration
- Same as any consumer: `@import "@vuleng/design-system";` in `global.css`.
- Astro's component scoped styles + design-system utilities work together cleanly.
- Dark mode toggle: client-side script on the `<html>` element, identical to Next.js apps.

## Status

This file is a **draft** placeholder for v2.0. The Astro + Sanity stack is used in production at Vulkan but the canonical patterns haven't been distilled into this doc yet. Coming in a v2.x update.
