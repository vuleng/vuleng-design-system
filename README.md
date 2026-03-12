# @vuleng/tailwind-preset

Shared design system for Vulkan Engineering — delivered as a **Tailwind CSS preset**.

Includes brand tokens (colors, fonts, dark mode surfaces), and component classes (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.card`, `.input-field`, `.badge`) with a **soft glass** aesthetic.

## Quick Start

```bash
# Install from local path (monorepo)
npm install ../vuleng-design-system

# Or from a git URL
npm install git+https://github.com/vuleng/vuleng-design-system.git
```

```js
// tailwind.config.js
export default {
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
| Colors | `vulkan-orange`, `vulkan-orange-hover`, `vulkan-orange-light`, `vulkan-navy`, `vulkan-bg`, `vulkan-gray`, `vulkan-black`, dark mode surfaces, extended orange/navy scales |
| Fonts | Lato (sans-serif stack) |
| Dark mode | Class-based (`darkMode: 'class'`) |
| Buttons | `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger` (soft glass) |
| Cards | `.card` |
| Inputs | `.input-field` |
| Badges | `.badge` |

## Documentation

| File | Content |
|------|---------|
| [BRAND.md](BRAND.md) | Colors, typography, logo rules, iconography, no-emoji policy |
| [COMPONENTS.md](COMPONENTS.md) | Button, card, input, modal, toast, badge patterns |
| [TAILWIND.md](TAILWIND.md) | Preset usage, manual config fallback, CSS custom properties |
| [DARK_MODE.md](DARK_MODE.md) | Dark mode strategy and tokens |
| [ANIMATIONS.md](ANIMATIONS.md) | Motion and transition guidelines |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | a11y requirements |
| [RESPONSIVE.md](RESPONSIVE.md) | Breakpoint strategy |

## Updating Apps

When the preset is updated:

1. Bump the version in `package.json`
2. Commit and push
3. In each consuming app: `npm update @vuleng/tailwind-preset`
4. Rebuild — done
