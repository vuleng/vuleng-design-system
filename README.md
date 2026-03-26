# @vuleng/tailwind-preset

Shared design system for Vulkan Engineering — delivered as a **Tailwind CSS preset**.

Includes brand tokens (colors, fonts, dark mode surfaces), and component classes (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.card`, `.input-field`, `.badge`) with a **soft glass** aesthetic.

Uses **navy-tinted neutrals** instead of generic grays for a cohesive, non-template look across light and dark mode.

> Part of the [Vulkan Engineering Company OS](https://github.com/vuleng/vuleng-company-os). For company identity, tone of voice, processes and organisational context, see that repo.

## Quick Start

```bash
npm install github:vuleng/vuleng-design-system#v1.0.0
```

**ESM project (Vite, etc.):**

```js
// tailwind.config.js
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export default {
  presets: [require('@vuleng/tailwind-preset')],
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,astro,html}'],
}
```

**CJS project:**

```js
// tailwind.config.js
module.exports = {
  presets: [require('@vuleng/tailwind-preset')],
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,astro,html}'],
}
```

```css
/* main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Done — all brand tokens and component classes are available.

## What's Included

| Feature | Details |
|---------|---------|
| Colors | `vulkan-orange`, `vulkan-navy`, `vulkan-bg`, dark mode surfaces, extended orange/navy scales, **navy-tinted `neutral-*` palette** |
| Fonts | Lato (sans-serif stack) |
| Typography | Heading tracking (`-0.02em`), body line-height (`1.6`), `max-w-prose`, `text-balance`, `text-pretty` |
| Dark mode | Class-based (`darkMode: 'class'`) |
| Buttons | `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-navy` (soft glass, hover lift) |
| Button sizes | `.btn-sm`, `.btn-lg` |
| Cards | `.card`, `.card-raised`, `.card-floating` (glass with 3-tier elevation) |
| Inputs | `.input-field`, `.select-field` (navy-tinted borders, double-ring focus) |
| Badges | `.badge` |
| Skeletons | `.skeleton`, `.skeleton-text`, `.skeleton-heading`, `.skeleton-avatar` |
| Shadows | `shadow-elevation-1`, `shadow-elevation-2`, `shadow-elevation-3` |
| Motion | `prefers-reduced-motion` global support, button hover-lift built in |

## Documentation

| File | Content |
|------|---------|
| [BRAND.md](BRAND.md) | Colors, typography, logo rules, iconography, no-emoji policy |
| [COMPONENTS.md](COMPONENTS.md) | Button, card, input, modal, toast, badge, skeleton, empty state patterns |
| [TAILWIND.md](TAILWIND.md) | Preset usage, manual config fallback, CSS custom properties |
| [DARK_MODE.md](DARK_MODE.md) | Dark mode strategy and tokens |
| [ANIMATIONS.md](ANIMATIONS.md) | Motion and transition guidelines |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | a11y requirements |
| [RESPONSIVE.md](RESPONSIVE.md) | Breakpoint and spacing strategy |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Living documentation standard, CLAUDE.md template, lessons learned |

## Standard Application Requirements

All Vulkan Engineering applications must implement:

1. **Internationalization**: Norwegian (default) + English, using translation keys and `localStorage`
2. **Dark/Light Mode**: Class-based toggle with `localStorage` persistence
3. **Living Documentation**: Focused `docs/` directory following [DOCUMENTATION.md](DOCUMENTATION.md)
4. **Test Discipline**: Tests updated in same commit as code changes

The AI instruction files (`ai/CLAUDE.md`, `ai/copilot-instructions.md`) include framework-specific sections for **Next.js** and **Astro + Sanity** projects. Copy the relevant sections when setting up a new project.

## AI Instructions (for Copilot, Claude, Cursor)

The `ai/` folder contains instruction files that make AI assistants follow the design system automatically.

Copy the appropriate file into each consuming project:

**GitHub Copilot (VS Code):**
```bash
# Copy into .github/ in your project
cp node_modules/@vuleng/tailwind-preset/ai/copilot-instructions.md .github/copilot-instructions.md
```

**Claude Code / Claude Projects:**
```bash
# Copy into project root
cp node_modules/@vuleng/tailwind-preset/ai/CLAUDE.md CLAUDE.md
```

**Cursor:**
```bash
# Copy into .cursor/rules/
mkdir -p .cursor/rules
cp node_modules/@vuleng/tailwind-preset/ai/copilot-instructions.md .cursor/rules/vulkan-design.md
```

These files contain the complete design rules: colors, components, typography, spacing, dark mode, motion, anti-patterns. The AI assistant will automatically follow these when generating UI code.

| File | Target | Purpose |
|------|--------|---------|
| [ai/copilot-instructions.md](ai/copilot-instructions.md) | `.github/copilot-instructions.md` | GitHub Copilot in VS Code |
| [ai/CLAUDE.md](ai/CLAUDE.md) | `CLAUDE.md` in project root | Claude Code, Claude Projects |

## Updating Apps

When the preset is updated:

1. Bump the version in `package.json`
2. Tag the release: `git tag v1.x.x && git push --tags`
3. In each consuming app: update the tag in `package.json` and run `npm install`
4. Rebuild — done
