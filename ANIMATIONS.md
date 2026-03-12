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

The standard Vulkan button hover uses a **lift effect** — the button moves up 1px and the orange shadow deepens:

```css
.btn-primary {
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(255, 137, 53, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(255, 137, 53, 0.3);
}
.btn-primary:active {
  transform: translateY(0);
}
```

In Tailwind `@apply`:

```css
.btn-primary {
  @apply hover:-translate-y-px active:translate-y-0
         shadow-[0_4px_6px_-1px_rgba(255,137,53,0.2)]
         hover:shadow-[0_6px_8px_-1px_rgba(255,137,53,0.3)];
}
```

Use the lift effect consistently across all projects.

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

```css
.input-field {
  transition: all 0.2s;
}

.input-field:focus {
  box-shadow: 0 0 0 3px rgba(255, 137, 53, 0.2);
}
```

Orange glow appears smoothly around focused inputs.

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
