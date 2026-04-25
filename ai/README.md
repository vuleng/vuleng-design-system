---
file: ai/README.md
audience: [human, ai]
scope: ai
stability: stable
last-verified: 2026-04-25
---

# AI Integration

> **What this is:** How AI assistants consume the Vulkan design system.
> **When to read it:** When setting up a new project that should follow Vulkan rules in AI-driven development.

## Recommended: Claude Code Plugin

`@vuleng/design-system` v2.0 ships a Claude Code plugin under `ai/plugin/`. It contains three lazy-loaded skills:

| Skill | Triggers when… | Loads |
|-------|----------------|-------|
| `vulkan-ui` | User asks about UI, components, colors, dark mode, theming | `design/*` + UI fragments |
| `vulkan-stack` | User asks about Next.js, Supabase, auth, deploy, testing, performance | `engineering/*` + stack fragments |
| `vulkan-bootstrap` | User wants to scaffold or initialize a new Vulkan project | `engineering/project-template.md` + standard-requirements |

Lazy loading means the 6000+ lines of design + engineering docs never sit in context unless a skill triggers — saving tokens and keeping responses fast.

### Install

```bash
/plugin install vuleng-design
```

The plugin is sister to `vulkan-skills` (which contains `cv-builder`, `pronav`, `mimir-*`, `vulkan-docx`, `pc-setup`). Both can be installed alongside.

### Verify

```bash
/plugin list
```

`vuleng-design` should appear as enabled, with three skills listed.

### Trigger explicitly

If a skill doesn't auto-trigger, ask Claude directly:

> Use the vulkan-ui skill to lag en knapp som...

## Fallback: Read Files Directly

If you're using Copilot, Cursor, or another AI assistant that doesn't support Claude Code plugins, point your tool at the markdown files directly:

| Working on… | Read |
|-------------|------|
| UI / design | `design/00-overview.md` (then drill into specific files) |
| Backend / stack | `engineering/00-overview.md` |
| Bootstrapping | `engineering/project-template.md` + `fragments/standard-requirements.md` |

There is no automatic context loading without the Claude Code plugin — your tool will read whatever you point it at.

## Generated Outputs

Source markdown files in `design/`, `engineering/`, and `ai/` may contain `<!-- include: fragments/foo.md -->` markers. Run `node scripts/build-fragments.mjs` to produce a `dist/` tree where every include is resolved inline (used at release time).

## What v2 Removed

v1.x shipped `ai/CLAUDE.md` and `ai/copilot-instructions.md` for copy-pasting into consuming projects. **v2.0 removes both** — the plugin replaces copy-paste, and projects that need a project-level `CLAUDE.md` should generate one via the `vulkan-bootstrap` skill instead.
