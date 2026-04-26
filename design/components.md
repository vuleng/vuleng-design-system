---
file: design/components.md
audience: [human, ai]
scope: design
stability: stable
last-verified: 2026-04-25
---

# Component Patterns

> **What this is:** Framework-agnostic UI recipes for buttons, cards, inputs, modals, toasts, badges, skeletons, and empty states.
> **When to read it:** When implementing any UI surface. The component CSS classes are defined in `preset.css`; this file shows how to apply them.
> **What it doesn't cover:** The bare class API (see `fragments/component-classes.md`) or color tokens (see `colors.md`).

The recipes below are *patterns*, not implementations — adapt to React, Astro, Vue, or plain HTML as needed.

## Buttons

Four button styles with a **soft glass** aesthetic — semi-transparent backgrounds, `backdrop-blur`, thin light borders, and smooth opacity transitions. No `translateY` bounce.

All classes are provided by `@vuleng/design-system`. Use them directly — no extra Tailwind needed. For the full class API reference, see `fragments/component-classes.md`.

### Primary Button

The main call-to-action. Orange with glass effect.

<!-- example: substitute your own button label and icon -->
```html
<button class="btn-primary">
  <svg class="w-5 h-5" ...><!-- icon --></svg>
  Save Changes
</button>
<button class="btn-primary" disabled>Processing...</button>
```

| State | Visual |
|-------|--------|
| Default | Semi-transparent orange, `backdrop-blur`, thin white border, soft shadow |
| Hover | Deeper orange, slightly elevated shadow |
| Active | Slight opacity reduction |
| Disabled | Slate gray, no blur, muted text |

**When to use:** Submit, save, confirm, primary navigation CTA.

### Secondary Button

Supporting action. Glass-white surface with a subtle border.

<!-- example: substitute your own button label -->
```html
<button class="btn-secondary">Cancel</button>
```

| State | Light | Dark |
|-------|-------|------|
| Default | Semi-transparent white, gray border | Semi-transparent `dark-surface`, muted border |
| Hover | Near-opaque white, navy border | Slightly brighter, lighter border |
| Disabled | 50% opacity | 50% opacity |

**When to use:** Cancel, back, secondary actions, filters.

### Ghost Button

Text-only with no background. Subtle fill on hover.

<!-- example: substitute your own button label -->
```html
<button class="btn-ghost">View details</button>
```

**When to use:** Tertiary actions, links that look like buttons, toolbar items.

### Danger Button

Red-tinted glass for destructive actions.

<!-- example: substitute your own button label and icon -->
```html
<button class="btn-danger">
  <svg class="w-5 h-5" ...><!-- trash icon --></svg>
  Delete
</button>
```

**When to use:** Delete, remove, reset — any irreversible or destructive action.

### Button Sizing

Override the default padding as needed:

| Size | Classes | Context |
|------|---------|---------|
| Small | `px-3 py-1.5 text-sm` | Inline actions, table rows |
| Default | Built into each class | Standard usage |
| Full-width | Add `w-full` | Mobile CTAs, form submit |

### Button with Icon

Always pair an SVG icon with text. Icon on the left, `w-5 h-5`, inherits `currentColor`.

<!-- example: substitute your own icon path and label -->
```html
<button class="btn-primary">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
       stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
  Download
</button>
```

---

## Cards

The `.card` class provides the base. Add padding and content as needed.

<!-- example: substitute your own card content -->
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

<!-- example: clickable card hover -->
```html
<div class="card p-6 hover:border-vulkan-orange hover:shadow-md transition-all cursor-pointer">
```

### Card with Status Indicator

<!-- example: pick your own status color -->
```html
<div class="card p-6 border-l-4 border-l-green-500">
  <!-- Content with left status border -->
</div>
```

---

## Inputs

Use the `.input-field` class for all form inputs.

<!-- example: substitute your own field name and placeholder -->
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

<!-- example: substitute your own field name and error message -->
```html
<input type="email" class="input-field border-red-500 focus:ring-red-500" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" class="mt-1 text-sm text-red-600" role="alert">Invalid email format</p>
```

### Input with Unit Label

Show the unit after the label:

<!-- example: substitute your own field name and unit -->
```html
<label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
  Temperature (°C)
</label>
<input type="number" class="input-field" />
```

### Textarea

<!-- example: substitute your own placeholder -->
```html
<textarea class="input-field resize-y" rows="4" placeholder="Describe the issue..."></textarea>
```

---

## Modals / Dialogs

Full-screen overlay with centered content panel.

<!-- example: substitute your own modal content -->
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

<!-- example: substitute your own toast message and type -->
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

| Type | Border | Background (Light) | Background (Dark) | Icon (SVG) |
|------|--------|--------------------|--------------------|------------|
| Success | `border-green-500` | `bg-green-50` | `bg-green-900/30` | `check-circle` |
| Error | `border-red-500` | `bg-red-50` | `bg-red-900/30` | `x-circle` |
| Warning | `border-yellow-500` | `bg-yellow-50` | `bg-yellow-900/30` | `exclamation-triangle` |
| Info | `border-blue-500` | `bg-blue-50` | `bg-blue-900/30` | `information-circle` |

**Position:** `fixed top-4 right-4 z-50`. Stack multiple toasts vertically with `gap-3`.

---

## Badges

Small status indicators. Use the `.badge` base class and add type-specific styles.

<!-- example: substitute your own badge labels -->
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

<!-- example: substitute your own pill label -->
```html
<span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black text-white bg-vulkan-orange uppercase tracking-wide shadow-sm">
  SET
</span>
```

---

## Headers / App Bar

Fixed top bar with logo, title, and action area.

<!-- example: substitute your own brand name and title -->
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

<!-- example: substitute your own user initials -->
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

<!-- example: substitute your own page name -->
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

<!-- example: substitute your own settings rows and danger items -->
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

<!-- example: bind to your own progress value -->
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

<!-- example: substitute your own loading message -->
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

<!-- example: substitute your own table columns and rows -->
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

## Skeleton Loaders

Use skeleton placeholders to indicate loading state instead of spinners when the layout is known. The `.skeleton` classes are provided by the preset.

### Card Skeleton

<!-- example: tune skeleton row count and widths to your card -->
```html
<div class="card p-6 space-y-4">
  <div class="skeleton skeleton-heading"></div>
  <div class="skeleton skeleton-text w-full"></div>
  <div class="skeleton skeleton-text w-4/5"></div>
  <div class="skeleton skeleton-text w-3/5"></div>
</div>
```

### List Skeleton

<!-- example: tune skeleton item count for your list -->
```html
<div class="space-y-3">
  <div class="flex items-center gap-3" v-for="i in 4" :key="i">
    <div class="skeleton skeleton-avatar"></div>
    <div class="flex-1 space-y-2">
      <div class="skeleton skeleton-text w-2/3"></div>
      <div class="skeleton skeleton-text w-1/3"></div>
    </div>
  </div>
</div>
```

### Table Skeleton

<!-- example: tune skeleton row count for your table -->
```html
<div class="card overflow-hidden">
  <div class="p-4 space-y-3">
    <div class="skeleton skeleton-text w-1/4"></div>
    <div class="space-y-2">
      <div class="skeleton h-10 w-full rounded"></div>
      <div class="skeleton h-10 w-full rounded"></div>
      <div class="skeleton h-10 w-full rounded"></div>
    </div>
  </div>
</div>
```

---

## Empty States

When a list, table, or section has no data, show a structured empty state instead of blank space.

<!-- example: substitute your own icon, heading, description, and CTA -->
```html
<div class="flex flex-col items-center justify-center py-16 px-6 text-center">
  <!-- Icon — use a relevant Heroicon, muted color -->
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
       stroke-width="1" stroke="currentColor"
       class="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4"
       aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>

  <h3 class="text-lg font-bold text-vulkan-navy dark:text-gray-100 mb-2">No documents yet</h3>
  <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-prose">
    Create your first document to get started. Documents help you track procedures and requirements.
  </p>

  <button class="btn-primary">
    <svg class="w-5 h-5" aria-hidden="true"><!-- plus icon --></svg>
    Create Document
  </button>
</div>
```

| Property | Value |
|----------|-------|
| Icon | Heroicon outline, `w-12 h-12`, muted neutral color |
| Heading | `text-lg font-bold text-vulkan-navy` |
| Description | `text-sm text-neutral-500`, max-width `max-w-prose` |
| CTA | Primary button (optional — only when user can create) |
| Spacing | `py-16` vertical padding |

---

## Error / Retry

When a data fetch or operation fails, show a clear error state with a retry action.

<!-- example: substitute your own error message and retry handler -->
```html
<div class="flex flex-col items-center justify-center py-12 px-6 text-center">
  <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor"
         class="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  </div>

  <h3 class="text-lg font-bold text-vulkan-navy dark:text-gray-100 mb-2">Something went wrong</h3>
  <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-prose">
    We couldn't load the data. Check your connection and try again.
  </p>

  <button class="btn-secondary" @click="retry">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" class="w-5 h-5" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
    Try Again
  </button>
</div>
```

---

## Button Loading State

When a button triggers an async action, show a spinner and disable interaction.

<!-- example: substitute your own button label and loading message -->
```html
<!-- Loading state -->
<button class="btn-primary" disabled>
  <svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
  Saving...
</button>

<!-- Normal state -->
<button class="btn-primary">
  Save Changes
</button>
```

**Rules:**
- Always add `disabled` during loading to prevent double-submission.
- Replace button text with a loading message (`Saving...`, `Deleting...`, etc.).
- Use the inline SVG spinner, not `animate-pulse` or a separate component.
- Keep the button the same width during loading to prevent layout shift.

### Full form submit pattern

<!-- example: substitute your own form fields and handler name -->
```html
<form @submit.prevent="handleSubmit">
  <!-- form fields -->
  <div class="flex gap-3 justify-end mt-6">
    <button type="button" class="btn-secondary" :disabled="isSubmitting">Cancel</button>
    <button type="submit" class="btn-primary" :disabled="isSubmitting">
      <template v-if="isSubmitting">
        <svg class="w-4 h-4 animate-spin" ...></svg>
        Saving...
      </template>
      <template v-else>
        Save Changes
      </template>
    </button>
  </div>
</form>
```

---

## Elevation Hierarchy

Cards and surfaces use three elevation levels. Use the lowest level that provides sufficient visual separation.

| Level | Class | Shadow | Usage |
|-------|-------|--------|-------|
| Resting | `.card` | `elevation-1` | Default cards, list items, form sections |
| Raised | `.card-raised` | `elevation-2` | Hovered cards, active selections, floating panels |
| Floating | `.card-floating` | `elevation-3` | Modals, dropdowns, popovers, toasts |

<!-- example: substitute your own card content -->
```html
<!-- Resting -->
<div class="card p-6">Default card</div>

<!-- Raised (e.g., on hover or selected) -->
<div class="card-raised p-6">Emphasized card</div>

<!-- Floating (e.g., dropdown panel) -->
<div class="card-floating p-4">Dropdown content</div>
```

---

## Empty States

When a list or section has no data:

<!-- example: substitute your own empty-state message and CTA -->
```html
<div class="flex flex-col items-center justify-center py-16 text-center">
  <div class="text-4xl mb-4">📋</div>
  <h3 class="text-lg font-bold text-gray-500 dark:text-gray-400 mb-2">No items yet</h3>
  <p class="text-sm text-gray-400 dark:text-gray-500 mb-6">Create your first item to get started.</p>
  <button class="btn-primary">Create Item</button>
</div>
```
