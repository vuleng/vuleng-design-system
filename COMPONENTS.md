# Component Patterns

> Framework-agnostic UI patterns for Vulkan Engineering apps. These are *recipes*, not implementations — adapt to Vue, Astro, React, or plain HTML as needed.

## Buttons

Two standard button styles. Use the global `.btn-primary` and `.btn-secondary` classes defined in [TAILWIND.md](TAILWIND.md).

### Primary Button

The main call-to-action. Orange background, white text, bold.

```html
<button class="btn-primary">Save Changes</button>
<button class="btn-primary" disabled>Processing...</button>
```

| State | Visual |
|-------|--------|
| Default | `bg-vulkan-orange`, white text, subtle shadow |
| Hover | `bg-vulkan-orange-hover`, `scale` or `translateY(-1px)` |
| Active | `scale-95` snap |
| Disabled | Gray background, muted text, `cursor-not-allowed` |

**When to use:** Submit, save, confirm, primary navigation CTA.

### Secondary Button

Supporting action. White/dark-surface background, navy text, border.

```html
<button class="btn-secondary">Cancel</button>
```

| State | Light | Dark |
|-------|-------|------|
| Default | White bg, gray border | `dark-surface` bg, gray-600 border |
| Hover | Border darkens | Border lightens |
| Disabled | 50% opacity | 50% opacity |

**When to use:** Cancel, back, secondary actions, filters.

### Button Sizing

| Size | Classes | Context |
|------|---------|---------|
| Small | `px-3 py-1.5 text-sm` | Inline actions, table rows |
| Default | `px-4 py-2` (secondary) / `px-6 py-3` (primary) | Standard usage |
| Full-width | Add `w-full` | Mobile CTAs, form submit |

---

## Cards

The `.card` class provides the base. Add padding and content as needed.

```html
<div class="card p-6">
  <h3 class="text-lg font-bold text-vulkan-navy dark:text-gray-100 mb-2">Card Title</h3>
  <p class="text-gray-600 dark:text-gray-400">Card description text.</p>
</div>
```

| Property | Value |
|----------|-------|
| Background | `bg-white` / `dark:bg-dark-surface` |
| Border | `border border-gray-200` / `dark:border-gray-700` |
| Radius | `rounded-xl` |
| Shadow | `shadow-sm` |
| Padding | `p-4` (compact), `p-6` (standard), `p-8` (spacious) |

### Card with Hover

For clickable cards, add hover state:

```html
<div class="card p-6 hover:border-vulkan-orange hover:shadow-md transition-all cursor-pointer">
```

### Card with Status Indicator

```html
<div class="card p-6 border-l-4 border-l-green-500">
  <!-- Content with left status border -->
</div>
```

---

## Inputs

Use the `.input-field` class for all form inputs.

```html
<label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
  Email
</label>
<input type="email" class="input-field" placeholder="name@vulkan.no" />
```

| State | Visual |
|-------|--------|
| Empty | `bg-white` / `dark:bg-dark-card`, gray border |
| Focused | Orange ring (`ring-2 ring-vulkan-orange`), border transparent |
| Filled | Same as empty, optionally show ✓ indicator |
| Error | Red border, red error text below |
| Disabled | `opacity-50 cursor-not-allowed` |

### Input with Error

```html
<input type="email" class="input-field border-red-500 focus:ring-red-500" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" class="mt-1 text-sm text-red-600" role="alert">Invalid email format</p>
```

### Input with Unit Label

Show the unit after the label:

```html
<label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
  Temperature (°C)
</label>
<input type="number" class="input-field" />
```

### Textarea

```html
<textarea class="input-field resize-y" rows="4" placeholder="Describe the issue..."></textarea>
```

---

## Modals / Dialogs

Full-screen overlay with centered content panel.

```html
<div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
     role="dialog" aria-modal="true">
  <div class="card p-8 max-w-lg w-full mx-4">
    <h2 class="text-xl font-bold text-vulkan-navy dark:text-gray-100 mb-4">Modal Title</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">Modal content goes here.</p>
    <div class="flex gap-3 justify-end">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| Backdrop | `bg-black/60`, `backdrop-blur-sm` |
| Panel | `.card` base, `p-8`, `max-w-lg`, `rounded-xl`, `shadow-2xl` |
| Z-index | `z-50` |
| Close | Click backdrop and/or Escape key |

**ARIA:** Always use `role="dialog"` and `aria-modal="true"`.

---

## Toasts / Notifications

Fixed-position notification with type-based styling.

```html
<div class="fixed top-4 right-4 z-50">
  <div class="px-6 py-4 rounded-lg shadow-xl border-l-4 border-green-500 bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200 flex items-center gap-3 max-w-md"
       role="alert">
    <span class="text-2xl">✓</span>
    <div>
      <p class="font-bold text-sm">Success</p>
      <p class="text-sm mt-1">Changes saved successfully.</p>
    </div>
    <button class="text-gray-400 hover:text-gray-600 ml-auto">✕</button>
  </div>
</div>
```

### Toast Types

| Type | Border | Background (Light) | Background (Dark) | Icon |
|------|--------|--------------------|--------------------|------|
| Success | `border-green-500` | `bg-green-50` | `bg-green-900/30` | ✓ |
| Error | `border-red-500` | `bg-red-50` | `bg-red-900/30` | ✕ |
| Warning | `border-yellow-500` | `bg-yellow-50` | `bg-yellow-900/30` | ⚠ |
| Info | `border-blue-500` | `bg-blue-50` | `bg-blue-900/30` | ℹ |

**Position:** `fixed top-4 right-4 z-50`. Stack multiple toasts vertically with `gap-3`.

---

## Badges

Small status indicators. Use the `.badge` base class and add type-specific styles.

```html
<span class="badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>
<span class="badge bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Critical</span>
<span class="badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Draft</span>
```

### Standard Badge Variants

Define these in your project's CSS if they match your domain:

| Badge | Light | Dark |
|-------|-------|------|
| Open / Active | `bg-green-100 text-green-800` | `bg-green-900/30 text-green-300` |
| Closed / Resolved | `bg-gray-100 text-gray-800` | `bg-gray-700 text-gray-300` |
| Critical / Error | `bg-red-100 text-red-800` | `bg-red-900/30 text-red-300` |
| Warning | `bg-yellow-100 text-yellow-800` | `bg-yellow-900/30 text-yellow-300` |
| Info / Approved | `bg-blue-100 text-blue-800` | `bg-blue-900/30 text-blue-300` |
| Pending / On Hold | `bg-purple-100 text-purple-800` | `bg-purple-900/30 text-purple-300` |
| Brand accent | `bg-vulkan-orange text-white` | Same |

### Pill Badges (full-round)

For action-type badges (like in OpsNav), use full-round with bold text:

```html
<span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black text-white bg-vulkan-orange uppercase tracking-wide shadow-sm">
  SET
</span>
```

---

## Headers / App Bar

Fixed top bar with logo, title, and action area.

```html
<header class="h-14 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 flex items-center px-4 shadow-sm z-30">
  <!-- Left: Logo -->
  <div class="flex items-center gap-3">
    <img :src="logo" alt="Vulkan Engineering" class="h-8 object-contain" />
  </div>

  <!-- Center: Title -->
  <div class="flex-1 text-center">
    <span class="text-sm font-bold text-vulkan-navy dark:text-gray-100">App Title</span>
  </div>

  <!-- Right: Actions -->
  <div class="flex items-center gap-2">
    <!-- User avatar, settings, etc. -->
  </div>
</header>
```

| Property | Value |
|----------|-------|
| Height | `h-14` (3.5rem) |
| Background | `bg-white` / `dark:bg-dark-surface` |
| Border | Bottom: `border-gray-200` / `dark:border-gray-700` |
| Shadow | `shadow-sm` |
| Z-index | `z-30` |
| Layout | Flex: `[left] | [center, flex-1] | [right]` |

### User Badge

Small avatar circle with initials:

```html
<div class="w-7 h-7 rounded-full bg-vulkan-navy/10 dark:bg-gray-700 flex items-center justify-center text-vulkan-navy dark:text-gray-300 font-bold text-xs">
  EH
</div>
```

---

## Sidebar

Collapsible navigation panel for apps with multi-page or multi-section structure.

| Property | Value |
|----------|-------|
| Width | `w-64` – `w-72` |
| Background | `bg-gray-50` / `dark:bg-dark-surface` |
| Border | Right: `border-gray-200` / `dark:border-gray-700` |
| Mobile | Fixed overlay, slides from left, z-20 |
| Desktop | Relative, part of normal flow |
| Scrollbar | `.custom-scroll` class |
| Transition | `transition-transform duration-300 ease-in-out` |

### Sidebar Nav Item

```html
<button class="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">
  Page Name
</button>

<!-- Active state (solid orange background) -->
<button class="w-full text-left px-4 py-2 rounded-lg text-sm bg-vulkan-orange text-white font-bold shadow-sm">
  Active Page
</button>
```

---

### Settings Dropdown / Floating Tools

A dropdown menu triggered by a gear icon, containing app-level settings (language, dark mode, auth).

```html
<div class="relative">
  <!-- Toggle: gear icon, rotates 90° when open -->
  <button class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card"
          :class="{ 'bg-gray-100 dark:bg-dark-card': open }">
    <svg class="w-5 h-5 transition-transform duration-300" :class="{ 'rotate-90': open }"><!-- gear --></svg>
  </button>

  <!-- Panel -->
  <div class="absolute top-14 right-0 w-64 bg-white dark:bg-dark-surface
              rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
    <div class="p-4 space-y-3">
      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2
                 border-b border-gray-100 dark:border-gray-700">Settings</h3>

      <!-- Each setting row -->
      <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-dark-card rounded-lg">
        <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Language</span>
        <!-- control -->
      </div>

      <!-- Danger items (e.g. logout, reset) -->
      <button class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg p-2.5 w-full text-left text-sm">
        Logout
      </button>
    </div>
  </div>
</div>
```

| Property | Value |
|----------|-------|
| Toggle | `w-10 h-10 rounded-full`, gear icon rotates `90°` when open |
| Panel | `absolute top-14 right-0 w-64`, `rounded-xl shadow-2xl` |
| Item rows | `p-2.5 bg-gray-50 dark:bg-dark-card rounded-lg` |
| Danger items | `text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20` |
| Animation | See [ANIMATIONS.md](ANIMATIONS.md) — dropdown with `scale(0.95) translateY(-4px)` |

---

## Progress Bar

Horizontal bar showing completion percentage.

```html
<div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
  <div class="h-full bg-vulkan-orange rounded-full transition-all duration-700 ease-out"
       :style="{ width: progress + '%' }"
       role="progressbar"
       :aria-valuenow="progress"
       aria-valuemin="0"
       aria-valuemax="100">
  </div>
</div>
```

---

## Loading Spinner

Full-screen or inline loading indicator.

```html
<!-- Full-screen overlay -->
<div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
  <div class="card p-8 flex flex-col items-center gap-4">
    <div class="w-16 h-16 border-4 border-vulkan-orange border-t-transparent rounded-full animate-spin"></div>
    <p class="text-vulkan-navy dark:text-gray-200 font-bold">Loading...</p>
  </div>
</div>

<!-- Inline spinner -->
<div class="w-5 h-5 border-2 border-vulkan-orange border-t-transparent rounded-full animate-spin"></div>
```

---

## Tables

For data-heavy views:

```html
<div class="card overflow-hidden">
  <table class="w-full text-sm">
    <thead class="bg-gray-50 dark:bg-dark-card text-left">
      <tr>
        <th class="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Name</th>
        <th class="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">Status</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
      <tr class="hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">
        <td class="px-4 py-3 text-gray-900 dark:text-gray-100">Item name</td>
        <td class="px-4 py-3"><span class="badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

| Property | Value |
|----------|-------|
| Container | `.card` with `overflow-hidden` |
| Header | `bg-gray-50` / `dark:bg-dark-card` |
| Row dividers | `divide-y divide-gray-200` / `dark:divide-gray-700` |
| Row hover | `hover:bg-gray-50` / `dark:hover:bg-dark-card` |
| Cell padding | `px-4 py-3` |

---

## Empty States

When a list or section has no data:

```html
<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="text-4xl mb-4">📋</div>
  <h3 class="text-lg font-bold text-gray-500 dark:text-gray-400 mb-2">No items yet</h3>
  <p class="text-sm text-gray-400 dark:text-gray-500 mb-6">Create your first item to get started.</p>
  <button class="btn-primary">Create Item</button>
</div>
```
