# Migration: v1.x → v2.0

This guide walks you through upgrading a consuming app from `@vuleng/tailwind-preset` v1.x to `@vuleng/design-system` v2.0.

## What Changes

- **Package name:** `@vuleng/tailwind-preset` → `@vuleng/design-system`. (The git URL is unchanged: `github:vuleng/vuleng-design-system`.)
- **Tailwind v3 → v4.** The preset is now CSS-first.
- **No more `tailwind.config.js` / `tailwind.config.ts`.** All configuration moves to CSS.
- **`@vuleng/tailwind-preset` JS preset removed.** Replaced by `@vuleng/design-system` CSS imports.
- **AI instructions removed.** No more `ai/CLAUDE.md` / `ai/copilot-instructions.md` to copy. Use the Claude Code plugin instead.

## What Stays The Same

- The visual output. v2 with the default Vulkan theme is pixel-identical to v1.2.0 at the brand level.
- All v1 class names: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-navy` (now alias of `.btn-accent`), `.card`, `.card-raised`, `.card-floating`, `.input-field`, `.select-field`, `.badge`, `.skeleton*`.
- All v1 Tailwind tokens: `bg-vulkan-orange`, `text-vulkan-navy`, `bg-vulkan-bg`, `text-vulkan-gray`, `text-vulkan-black`, `orange-{50–950}`, `navy-{50–950}`, `dark-bg`, `dark-surface`, `dark-card`.
- The dark-mode strategy: `.dark` class on `<html>`.

## Step-by-Step

### 1. Bump dependencies

In your app's `package.json`:

```diff
{
  "dependencies": {
-   "@vuleng/tailwind-preset": "github:vuleng/vuleng-design-system#v1.2.0"
+   "@vuleng/design-system": "github:vuleng/vuleng-design-system#v2.0.0"
  },
  "devDependencies": {
-   "tailwindcss": "^3.4.0"
+   "tailwindcss": "^4.0.0"
  }
}
```

Run:

```bash
npm install
```

### 2. Replace your CSS import

In your main CSS file (typically `src/app/globals.css` for Next.js):

```diff
- @tailwind base;
- @tailwind components;
- @tailwind utilities;
+ @import "@vuleng/design-system";
```

For client-themed apps:

```css
@import "@vuleng/design-system/preset";
@import "./themes/your-theme.css";
```

### 3. Delete `tailwind.config.ts`

Tailwind v4 is config-less by default. Delete the file:

```bash
rm tailwind.config.ts   # or tailwind.config.js
```

If your old config had **app-specific** customization (additional fonts, app-only colors, custom keyframes), move them into your main CSS using `@theme`:

```css
@import "@vuleng/design-system";

@theme {
  --color-app-accent: #00ff88;
  --font-serif: "Playfair Display", Georgia, serif;
}

@layer utilities {
  @keyframes my-fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-my-fade-in { animation: my-fade-in 0.4s ease-out both; }
}
```

### 4. Remove old AI rule files (optional but recommended)

If you previously copied `ai/CLAUDE.md` or `ai/copilot-instructions.md` into your project:

```bash
rm CLAUDE.md  # or wherever you placed it
rm .github/copilot-instructions.md
rm -rf .cursor/rules/vulkan-design.md
```

If you use Claude Code, install the new plugin:

```bash
/plugin install vuleng-design
```

The plugin replaces those files. Skills auto-load when relevant — your project's own `CLAUDE.md` (if any) doesn't need design-system rules anymore.

If you use Copilot or Cursor: those tools don't support the plugin. Point them at the `design/` and `engineering/` markdown files directly.

### 5. Verify

```bash
npm run build
npm test
npm run dev
```

Check that:
- The build succeeds.
- The app looks the same (open it side-by-side with a v1.x preview if possible).
- Dark mode toggles correctly.
- Buttons, cards, inputs, badges all render with the right colors.
- No console warnings about missing CSS variables.

### 6. Tag your app's bump commit

```bash
git add -A
git commit -m "chore: upgrade @vuleng/design-system to v2.0.0"
git push
```

## Optional Cleanup (post-migration)

Now that you're on v2, consider these polish steps. None are blocking.

### Replace v1 tokens with semantic tokens

If you intend to ever re-theme this app for a client, migrate Vulkan-pinned class names to semantic ones:

| v1 (Vulkan-pinned) | v2 (semantic, theme-aware) |
|--------------------|----------------------------|
| `bg-vulkan-orange` | `bg-brand-primary` |
| `text-vulkan-navy` | `text-brand-accent` |
| `bg-vulkan-bg` | `bg-page-bg` |
| `text-vulkan-gray` | `text-text-muted` |
| `text-vulkan-black` | `text-text-default` |
| `bg-orange-400` | `bg-brand-primary` |
| `bg-navy-700` | `bg-brand-accent` |
| `bg-dark-card` | `bg-card-bg` (auto-flips with mode) |

For internal Vulkan tools that will never be re-themed, the v1 names still work — no need to migrate.

### Replace inline `rgba(...)` brand hexes with var refs

If your app's `globals.css` or component styles hardcode brand colors:

```diff
- background: linear-gradient(135deg, rgba(255, 137, 53, 0.1), rgba(255, 137, 53, 0.05));
+ background: linear-gradient(135deg, rgb(var(--color-brand-primary-rgb) / 0.1), rgb(var(--color-brand-primary-rgb) / 0.05));
```

### Switch `.btn-navy` to `.btn-accent`

```diff
- <button class="btn-navy">Confirm</button>
+ <button class="btn-accent">Confirm</button>
```

`.btn-navy` keeps working in v2 as a legacy alias, but `.btn-accent` is the canonical name going forward.

## Common Issues

See [`engineering/troubleshooting.md`](engineering/troubleshooting.md) for solutions to:
- Component classes don't render
- Brand colors are wrong / missing
- Dark mode not flipping
- Alpha modifier produces wrong color
- `tailwind.config.ts` exists and breaks the build
- Build complains about `darkMode: 'class'`

## Rollback

If something breaks and you need to revert:

```bash
git revert <commit-sha>
npm install
```

The git URL `github:vuleng/vuleng-design-system#v1.2.0` is permanent — old versions don't disappear.

Then file an issue with the build error or visual diff so we can patch v2.x.
