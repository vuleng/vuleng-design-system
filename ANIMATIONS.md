# Animations & Motion

> Timing, easing, and motion conventions for all Vulkan Engineering apps.

## Philosophy

Motion is **functional, not decorative**. Every animation serves exactly one purpose:

| Purpose | Example |
|---------|---------|
| **Feedback** | Button hover lift, checkbox toggle |
| **Orientation** | Sidebar slide, dropdown open/close |
| **Progress** | Progress bar fill, loading spinner |

If an animation doesn't serve one of these, remove it.

## Timing Scale

Use these durations consistently across all projects:

| Duration | Token | Use Case |
|----------|-------|----------|
| `150ms` | `duration-150` | Fast exits (dropdown close, tooltip hide) |
| `200ms` | `duration-200` | Micro-interactions (hover, border, focus, toggle) |
| `300ms` | `duration-300` | Layout shifts (sidebar slide, modal enter, fade-in) |
| `700ms` | `duration-700` | Progress visualization (bar fill, counters) |

**Rule:** Direct interactions → `200ms`. Layout changes → `300ms`. Progress → `700ms`.

## Easing Functions

| Easing | CSS | When |
|--------|-----|------|
| Default | `ease` | Hover states, general transitions |
| Ease-out | `ease-out` | Elements entering view (decelerate in) |
| Ease-in | `ease-in` | Elements leaving view (accelerate out) |
| Overshoot | `cubic-bezier(0.16, 1, 0.3, 1)` | Dropdowns, popovers (subtle bounce) |
| Linear | `linear` | Spinners, continuous animations |

## Standard Patterns

### Button Hover

All Vulkan buttons (primary, secondary, navy, danger) use a **lift effect** — the button moves up 1px and the shadow deepens. This is built into the preset classes.

```css
/* Already in preset.js — no extra CSS needed */
.btn-primary {
  transition: background-color 150ms ease, opacity 150ms ease,
              box-shadow 150ms ease, transform 150ms ease;
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  /* shadow deepens automatically */
}
.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}
```

The lift effect is consistent across `.btn-primary`, `.btn-secondary`, `.btn-danger`, and `.btn-navy`.

**Note:** `.btn-ghost` does not lift — it only fills with a subtle background.

### Card Hover

```html
<div class="card p-6 transition-all duration-200 hover:border-vulkan-orange hover:shadow-md">
```

Border highlights to orange + subtle shadow. `200ms ease`.

### Sidebar Slide (Mobile)

```html
<aside class="fixed inset-y-0 left-0 w-72 transform -translate-x-full transition-transform duration-300 ease-in-out"
       :class="{ 'translate-x-0': isOpen }">
```

Slides from left. `300ms ease-in-out`.

### Dropdown / Popover

Using Vue `<Transition>`:

```css
.dropdown-enter-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-leave-active { transition: all 0.15s ease-in; }
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}
```

Scale + fade with overshoot easing on enter, fast fade out on leave.

### Toast Entry

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.toast-enter {
  animation: fade-in 0.3s ease-out;
}
```

Slides down from top corner and fades in.

### Progress Bar Fill

```html
<div class="h-full bg-vulkan-orange rounded-full transition-all duration-700 ease-out"
     :style="{ width: progress + '%' }">
</div>
```

Width animates over `700ms` with deceleration — feels like the bar is "settling".

### Chevron / Expand Toggle

```html
<svg class="w-4 h-4 transition-transform duration-200"
     :class="{ 'rotate-180': isExpanded }">
```

Simple 180° rotation at `200ms`.

### Focus Ring

Inputs and selects use a **double-ring glow** for focus — an inner solid ring and an outer diffused ring, both in brand orange:

```css
/* Already in preset.js */
.input-field:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px rgba(224, 117, 32, 0.5),
              0 0 0 4px rgba(224, 117, 32, 0.15);
}
```

The transition uses `200ms ease` for a smooth appearance.

## Tailwind Animation Utilities

Use these built-in Tailwind animations:

| Class | Effect | Duration | Use |
|-------|--------|----------|-----|
| `animate-spin` | 360° rotation | 1s, linear, infinite | Loading spinners |
| `animate-pulse` | Opacity fade | 2s, ease-in-out, infinite | Attention CTAs (use sparingly) |
| `animate-bounce` | Vertical bounce | 1s, infinite | Avoid in production (too playful) |

## Don'ts

- **Don't animate layout properties** (`width`, `height`) on complex elements — use `transform` instead.
- **Don't exceed `300ms`** for interaction feedback.
- **Don't use `animate-bounce`** in production UI — it doesn't match the industrial tone.
- **Don't animate on page load** unless it serves orientation (e.g., staggered list items).
- **Don't use spring physics or playful easing** — keep it professional and snappy.

## Reduced Motion

The preset includes a global `prefers-reduced-motion` media query that disables all transitions and animations for users who request it. This is applied automatically — no per-component work needed.

For elements where you add custom animations outside the preset, use Tailwind's `motion-reduce:` prefix:

```html
<div class="transition-all motion-reduce:transition-none">
```

Or scope your keyframe animation:

```html
<div class="animate-spin motion-reduce:animate-none">
```
