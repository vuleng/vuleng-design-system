---
file: design/dark-mode.md
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

# Dark Mode

> **What this is:** Implementation strategy and the light↔dark color mapping.
> **When to read it:** When wiring up the dark mode toggle, or when verifying that a new component flips correctly.
> **What it doesn't cover:** Brand voice in dark mode (see `brand.md`), motion preferences (see `motion.md`).

## Color Mapping

<!-- include: fragments/neutral-mapping.md -->

## Implementation

### 1. Toggle on `<html>`

```ts
// On boot, before paint, to avoid FOUC:
const stored = localStorage.getItem("vulkan_dark_mode");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const isDark = stored !== null ? stored === "true" : systemDark;
document.documentElement.classList.toggle("dark", isDark);
```

### 2. Toggle handler

```ts
function toggleDarkMode() {
  const next = !document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", next);
  localStorage.setItem("vulkan_dark_mode", String(next));
}
```

### 3. Component code

Most components need **no explicit dark-mode CSS**. The preset's component classes (`.btn-primary`, `.card`, etc.) reference theme variables that flip automatically when `.dark` is toggled.

For Tailwind utility usage, use the `dark:` modifier:

```html
<div class="bg-surface text-text-default">
  <!-- Auto-flips: tokens are mode-aware -->
</div>

<div class="bg-white dark:bg-dark-surface">
  <!-- Manual: when you need different colors than the tokens provide -->
</div>
```

## Checklist for New Components

- [ ] Use semantic tokens (`bg-surface`, `text-text-default`, `border-border`) — they flip automatically
- [ ] If you need explicit dark-mode behavior, use `dark:` modifier with `dark-surface`, `dark-card`, etc.
- [ ] Test by adding `class="dark"` to `<html>` and reloading
- [ ] Verify focus rings are visible in both modes (orange focus ring is mode-stable)
- [ ] Verify icons stay readable (use `currentColor` so they inherit text color)
