---
file: engineering/troubleshooting.md
audience: [human, ai]
scope: engineering
stability: stable
last-verified: 2026-04-25
---

# Troubleshooting

> **What this is:** Common failures and their fixes when consuming `@vuleng/design-system` v2.x.
> **When to read it:** When something doesn't render, doesn't theme, or doesn't compile as expected.

## Tailwind v4 / Preset Issues

### Component classes don't render

**Symptom:** `.btn-primary`, `.card`, etc. produce no styles.

**Cause:** You're still on Tailwind v3, or you forgot to import the preset CSS.

**Fix:**
<!-- pattern: required default-theme import -->
```css
/* In your app's main CSS (e.g. globals.css) */
@import "@vuleng/design-system";
```

Make sure `package.json` has `"tailwindcss": "^4.0.0"` and you have **no** `tailwind.config.js`/`tailwind.config.ts` in v3 format. v4 is config-less by default.

### Brand colors are wrong / missing

**Symptom:** `bg-brand-primary` produces no background, or default Tailwind colors leak through.

**Cause:** You're importing only the preset, not a theme.

**Fix:** Use the package root for default Vulkan branding:
<!-- pattern: required default-theme import -->
```css
@import "@vuleng/design-system";
```

Or import preset + theme separately for client-themed apps:
<!-- pattern: required client-theme override structure (preset before theme) -->
```css
@import "@vuleng/design-system/preset";
@import "./themes/your-theme.css";
```

### Dark mode not flipping

**Symptom:** Toggling `.dark` on `<html>` does nothing.

**Cause:** Either the dark variant isn't registered, or the theme doesn't define a `.dark` block.

**Fix:** Verify your theme has a `.dark { ... }` block with all the dark counterparts. The preset registers `@custom-variant dark (&:where(.dark, .dark *))` automatically — check your CSS for an accidental override.

### Alpha modifier produces wrong color

**Symptom:** `bg-brand-primary/50` looks washed out or wrong.

**Cause:** You have `--color-brand-primary` defined as a non-color CSS variable (e.g. just the name `vulkan-orange` without a hex value), or you're missing `--color-brand-primary-rgb` for components that use the rgb-triplet form.

**Fix:** A theme must define both forms:
<!-- pattern: required hex + RGB-triplet pair for color tokens -->
```css
--color-brand-primary: #FF8935;
--color-brand-primary-rgb: 255 137 53;
```

## Migrating from v1.x

### `tailwind.config.ts` exists and breaks the build

**Cause:** v1.x apps used `presets: [require("@vuleng/tailwind-preset")]` in a JS config. v2.0 is CSS-first; the JS config is no longer needed.

**Fix:** Delete or empty `tailwind.config.ts`. Move all token customization into your main CSS:
<!-- example: substitute your own custom tokens -->
```css
@import "@vuleng/design-system";

/* Custom app-specific tokens */
@theme {
  --color-app-accent: #00ff88;
  --font-serif: "Playfair Display", Georgia, serif;
}
```

### `bg-vulkan-orange` works but `bg-brand-primary` doesn't

**Cause:** You're importing only `themes/vulkan` without `preset.css`.

**Fix:** Use the package root entry, which loads both:
<!-- pattern: required default-theme import -->
```css
@import "@vuleng/design-system";
```

### Build complains about `darkMode: 'class'`

**Cause:** Old v1 config still references the deprecated v3 option.

**Fix:** Remove `tailwind.config.ts` entirely. The dark variant is registered by the preset.

## Plugin / AI Issues

### Claude Code plugin doesn't trigger

**Symptom:** Asking Claude about Vulkan UI doesn't load the design system context.

**Cause:** Plugin not installed, or skill descriptions don't match your phrasing.

**Fix:**
1. Install: `/plugin install vuleng-design`
2. Verify: `/plugin list` should show it as enabled.
3. Trigger explicitly: "Use the vulkan-ui skill to ..."

### Fragment include marker not resolved

**Symptom:** Reading a published doc, you see `<!-- include: fragments/foo.md -->` instead of the inlined content.

**Cause:** You're reading the source repo directly, not the built `dist/` output.

**Fix:** Run `node scripts/build-fragments.mjs` to produce a `dist/` tree with all includes resolved. CI should do this on release.
