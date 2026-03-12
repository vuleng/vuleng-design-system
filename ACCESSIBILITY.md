# Accessibility

> The non-negotiable accessibility minimums for all Vulkan Engineering apps.

## Principles

1. **Keyboard-navigable.** Every action reachable by mouse must be reachable by keyboard.
2. **Screen reader friendly.** Use semantic HTML and ARIA where semantics fall short.
3. **Visible focus.** Every focusable element shows a visible focus ring.
4. **Color is not enough.** Never convey meaning through color alone — always pair with text, icons, or shape.

## Focus Rings

All focusable elements must show a visible focus indicator. Use this pattern:

```html
focus:ring-2 focus:ring-vulkan-orange focus:outline-none
```

For inputs, also add an orange glow:

```css
.input-field:focus {
  box-shadow: 0 0 0 3px rgba(255, 137, 53, 0.2);
}
```

**Never** use `outline: none` without a replacement focus indicator.

## Semantic HTML

Use the right elements before reaching for ARIA:

| Need | Use | Not |
|------|-----|-----|
| Navigation | `<nav>` | `<div class="nav">` |
| Page title | `<h1>` | `<div class="title">` |
| Button | `<button>` | `<div @click>` |
| Link | `<a href>` | `<span @click>` |
| Input label | `<label>` | `<span>` |
| Page header | `<header>` | `<div class="header">` |
| Main content | `<main>` | `<div class="content">` |
| List | `<ul>` / `<ol>` | `<div>` with items |

## ARIA Patterns

### Dialogs / Modals

```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Action</h2>
  <!-- content -->
</div>
```

### Alerts / Toasts

```html
<div role="alert">
  <p><strong>Error:</strong> Something went wrong.</p>
</div>
```

`role="alert"` causes screen readers to announce the content immediately.

### Form Validation

```html
<input
  type="email"
  class="input-field"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" class="text-sm text-red-600" role="alert">
  Invalid email address
</p>
```

### Progress Bars

```html
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
```

### Status Badges

```html
<span role="status" class="badge bg-green-100 text-green-800">Active</span>
```

### Interactive Labels

Every button, link, and interactive element without visible text needs `aria-label`:

```html
<button aria-label="Close dialog" class="p-2">✕</button>
<button aria-label="Toggle sidebar menu" class="md:hidden">☰</button>
<button aria-label="Toggle dark mode">🌙</button>
```

## Keyboard Navigation

### Standard Expectations

| Key | Expected Behavior |
|-----|-------------------|
| `Tab` | Move focus to next focusable element |
| `Shift+Tab` | Move focus to previous focusable element |
| `Enter` / `Space` | Activate button or link |
| `Escape` | Close modal, dropdown, or popover |
| `Arrow keys` | Navigate within lists, menus, tabs |

### Modal Focus Trapping

When a modal is open:
1. Focus moves to the first focusable element inside the modal.
2. `Tab` cycles through modal elements only (doesn't reach background).
3. `Escape` closes the modal and returns focus to the trigger element.

### App-Specific Shortcuts

If your app defines keyboard shortcuts:
- Disable them when the user is typing in an `<input>` or `<textarea>`.
- Document shortcuts in a help dialog or tooltip.
- Don't override browser defaults (`Ctrl+C`, `Ctrl+V`, etc.).

## Color Contrast

### Minimum Ratios (WCAG AA)

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text (< 18px) | 4.5:1 |
| Large text (≥ 18px bold / ≥ 24px normal) | 3:1 |
| UI components & graphical objects | 3:1 |

### Vulkan Palette Contrast

| Combination | Approx. Ratio | Passes |
|-------------|---------------|--------|
| `#3F3F3F` on `#F5F9FF` | ~9:1 | AA, AAA |
| `#e2e8f0` on `#0f172a` | ~12:1 | AA, AAA |
| `#183653` on `#F5F9FF` | ~10:1 | AA, AAA |
| `white` on `#FF8935` | ~3:1 | AA large |
| `#6B7280` on `white` | ~5:1 | AA |
| `#94a3b8` on `#1e293b` | ~5:1 | AA |

White text on `vulkan-orange` meets AA for large text (bold buttons, headings). For smaller text on orange backgrounds, use navy instead.

## Images and Icons

- All `<img>` elements must have `alt` attributes.
- Decorative images: `alt=""` (empty, not omitted).
- Informative images: Descriptive alt text.
- SVG icons: Use `aria-hidden="true"` if accompanied by text, or `role="img" aria-label="..."` if standalone.

```html
<!-- Icon with text — hide icon from screen readers -->
<button>
  <svg aria-hidden="true" class="w-5 h-5">...</svg>
  Save
</button>

<!-- Icon-only button — label the button -->
<button aria-label="Settings">
  <svg aria-hidden="true" class="w-5 h-5">...</svg>
</button>
```

## Language

Set the document language to match the active locale:

```html
<html lang="no">  <!-- Norwegian -->
<html lang="en">  <!-- English -->
```

If using vue-i18n or similar, update `document.documentElement.lang` when the language changes.

## Motion Sensitivity

Consider users who prefer reduced motion:

```html
<!-- Tailwind way -->
<div class="transition-all motion-reduce:transition-none">
```

Or in CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Checklist for New Components

- [ ] All interactive elements are focusable (`<button>`, `<a>`, or `tabindex="0"`)
- [ ] Visible focus ring on all focusable elements
- [ ] `aria-label` on icon-only buttons and non-text interactive elements
- [ ] Form inputs have associated `<label>` elements
- [ ] Error states use `aria-invalid` and `aria-describedby`
- [ ] Modals use `role="dialog"` and `aria-modal="true"`
- [ ] Dynamic notifications use `role="alert"` or `role="status"`
- [ ] Color is never the sole indicator — text/icon/shape accompanies
- [ ] Images have `alt` attributes
- [ ] Keyboard can reach and activate all interactive elements
- [ ] No content is hidden that should be accessible

## Checklist for New Pages

- [ ] Logical heading hierarchy (`h1` → `h2` → `h3`, no skipping)
- [ ] `<main>` landmark wraps the primary content
- [ ] `<nav>` landmarks for navigation areas
- [ ] Page `<title>` is descriptive and unique
- [ ] Language attribute is set on `<html>`
- [ ] Tab order follows visual reading order
