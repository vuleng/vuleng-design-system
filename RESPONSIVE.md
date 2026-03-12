# Responsive Design

> Breakpoints, layout conventions, and mobile-first patterns for all Vulkan Engineering apps.

## Approach

All Vulkan apps are **mobile-first**. Write base styles for phones, then enhance with breakpoints.

## Breakpoints

Use Tailwind's default breakpoints:

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0 | Phones (portrait) |
| `sm:` | 640px | Large phones, landscape |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Small desktops, tablets landscape |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

**Most apps only need `md:` and `lg:`.** Don't over-breakpoint — if `sm:` changes are minor, skip them.

## Standard Layouts

### App Shell (Internal Tools)

```
┌──────────────────────────────────────────────┐
│  Header (h-14, sticky, z-30)                 │
├──────────────────────────────────────────────┤
│           │                                  │
│  Sidebar  │       Main Content               │
│  (w-64+)  │       (flex-1, scrollable)       │
│           │                                  │
└──────────────────────────────────────────────┘
```

- Header: Fixed height `h-14`, always visible.
- Sidebar: `w-64` to `w-72`. Fixed overlay on mobile, relative on desktop.
- Main content: `flex-1`, scrollable with `.custom-scroll`.
- Root: `100vw × 100dvh`, `overflow: hidden` on body.

### Content Page (Website / Marketing)

```
┌──────────────────────────────────────────────┐
│  Navbar                                      │
├──────────────────────────────────────────────┤
│                                              │
│           Content (max-w-7xl mx-auto)        │
│                                              │
├──────────────────────────────────────────────┤
│  Footer                                      │
└──────────────────────────────────────────────┘
```

- Content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Normal scrolling (no `overflow: hidden`).

### Dashboard (Grid)

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <div class="card p-6">...</div>
  <div class="card p-6">...</div>
  <div class="card p-6">...</div>
</div>
```

## Common Responsive Patterns

### Stack → Row

Vertical on mobile, horizontal on desktop:

```html
<div class="flex flex-col md:flex-row gap-4 md:gap-6">
  <div class="flex-1">Left</div>
  <div class="flex-1">Right</div>
</div>
```

### Sidebar Toggle

| Screen | Sidebar Behavior | Hamburger |
|--------|-----------------|-----------|
| Mobile (`< md`) | Fixed overlay, off-screen, slides in | Visible |
| Desktop (`md:+`) | Relative, always visible | Hidden (`md:hidden`) |

```html
<!-- Hamburger: visible on mobile only -->
<button class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg">
  <!-- icon -->
</button>

<!-- Sidebar: off-screen mobile, visible desktop -->
<aside class="fixed md:relative inset-y-0 left-0 w-72 transform -translate-x-full md:translate-x-0 transition-transform duration-300 z-20 md:z-auto">
```

### Show/Hide Elements

```html
<!-- Hidden on mobile, visible on tablet+ -->
<span class="hidden sm:flex">User name</span>

<!-- Visible on mobile, hidden on desktop -->
<button class="md:hidden">Menu</button>
```

### Responsive Padding

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Card content | `p-4` | `p-6` | `p-8` |
| Page section | `px-4` | `px-6` | `px-8` |
| Content gap | `gap-4` | `gap-4` | `gap-6` |

```html
<div class="p-4 md:p-6 lg:p-8">
```

### Responsive Text

```html
<h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-vulkan-navy dark:text-gray-100">
```

## Viewport Configuration

Every app needs this in `index.html` / layout:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

For full-screen apps (internal tools), use dynamic viewport height:

```css
#app {
  height: 100vh;
  height: 100dvh;  /* Overrides for dvh support */
}
```

## Safe Area (Notched Devices)

For PWAs or full-screen mobile apps:

```css
@supports (padding-top: env(safe-area-inset-top)) {
  #app {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

And in the HTML head:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

## Touch Targets

All interactive elements must meet minimum touch sizes:

| Element | Minimum | Recommendation |
|---------|---------|----------------|
| Buttons | 44×44px | Use adequate padding, not min-width/height |
| Checkboxes | 28×28px | `w-7 h-7` with surrounding padding |
| Nav items | Full row width | `w-full` with `py-2` minimum |
| Close buttons | 40×40px | `w-10 h-10` |

Apply `touch-manipulation` to checkboxes and toggles to remove the 300ms tap delay:

```html
<button class="touch-manipulation">
```

## Content Width

| Context | Max Width | Usage |
|---------|-----------|-------|
| Marketing page | `max-w-7xl` | Main content area |
| Form / reading | `max-w-2xl` | Forms, articles, settings |
| Modal | `max-w-lg` | Dialog content |
| Toast | `max-w-md` | Notification message |
| Full-width | — | Dashboards, data tables |

## Testing

Test every layout at these widths:
- **375px** — iPhone SE (smallest common phone)
- **768px** — iPad portrait (`md:` breakpoint)
- **1024px** — iPad landscape / small laptop (`lg:` breakpoint)
- **1440px** — Standard desktop
