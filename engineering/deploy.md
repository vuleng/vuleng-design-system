---
file: engineering/deploy.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-25
---

# Deployment & Infrastructure

> **What this is:** Vercel setup, region config, env vars, custom domains, monitoring.
> **When to read it:** Before first deploy of a new app, when changing regions, or when configuring a custom domain.
> **What it doesn't cover:** Performance tuning post-deploy (see `performance.md`).

How to deploy Vulkan Engineering apps. Vercel is the recommended platform
for both Next.js and Astro projects.

---

## Vercel Setup

### 1. Connect Repository

Link your GitHub repo to Vercel. It auto-detects Next.js and Astro projects.

### 2. Set Region (Critical)

**Your Vercel Functions region MUST match your database region.**

Create `vercel.json` in the project root:

```json
{
  "regions": ["dub1"]
}
```

| Database Region | Vercel Region Code | Location |
|----------------|-------------------|----------|
| Supabase eu-west-1 | `dub1` | Dublin, Ireland |
| Supabase us-east-1 | `iad1` | Washington D.C. |
| Supabase ap-southeast-1 | `sin1` | Singapore |

See PERFORMANCE.md for why this matters (~150ms penalty per mismatch).

### 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Environments | Secret? |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | All | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | No |
| `SUPABASE_SERVICE_ROLE_KEY` | All | Yes |
| `ANTHROPIC_API_KEY` | All (if using AI) | Yes |

**Tip:** Set variables for Production, Preview, and Development separately
if you use different Supabase projects per environment.

---

## Deployment Flow

### Production
- Push to `main` → Vercel auto-deploys to production
- Custom domain (e.g., your-domain.no) points to production

### Preview
- Push any branch → Vercel creates a preview deployment
- Each PR gets its own URL (e.g., `myapp-git-feat-x-team.vercel.app`)
- Preview deployments are great for testing and code review

### Branch Protection
- Never push directly to `main`
- Use feature branches: `feat/my-feature`, `fix/my-bug`
- Always branch from latest `origin/main`:
  ```bash
  git fetch origin main && git checkout -b feat/my-feature origin/main
  ```

---

## Pre-Deploy Checklist

Before merging to main:

- [ ] `npm run build` passes (no errors)
- [ ] `npm test` passes (all green)
- [ ] Preview deployment works correctly
- [ ] No console errors in preview
- [ ] Mobile responsive (test in preview)
- [ ] Dark mode works (test in preview)
- [ ] i18n complete (both nb.json and en.json)

---

## Domain Setup

1. Add domain in Vercel Dashboard → Settings → Domains
2. Configure DNS at your registrar:
   - **A record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com` (for subdomains)
3. Vercel auto-provisions SSL certificate

### Recommended DNS Setup
```
example.no        → A record → 76.76.21.21
www.example.no    → CNAME → cname.vercel-dns.com
```

---

## Monitoring

### Vercel Runtime Logs
- Dashboard → Deployments → select deployment → Logs tab
- Filter by path, status code, log level
- Useful for debugging server-side issues

### Build Logs
- Dashboard → Deployments → select deployment → Build tab
- Shows compilation errors, ESLint warnings, bundle sizes

---

## Cost Management

Vercel free tier (Hobby) includes:
- 100GB bandwidth/month
- 100 hours serverless function execution
- Unlimited preview deployments
- 1 concurrent build

For production apps, Pro tier ($20/month per team member) adds:
- 1TB bandwidth
- 1000 hours function execution
- Faster builds, more concurrent builds
- Team collaboration features

Supabase free tier includes:
- 500MB database
- 1GB storage
- 50,000 monthly active users
- Unlimited API requests

Both free tiers are generous for small-to-medium Vulkan projects.
