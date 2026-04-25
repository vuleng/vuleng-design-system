#!/usr/bin/env node
/**
 * @vuleng/design-system — build-fragments.mjs
 *
 * Resolves <!-- include: fragments/foo.md --> markers in source markdown files,
 * inlining the fragment content. Used at release time to produce a `dist/`
 * tree where every file is self-contained, while the git source uses
 * fragment markers to keep the SSOT in `fragments/`.
 *
 * Usage:
 *   node scripts/build-fragments.mjs            # writes ./dist
 *   node scripts/build-fragments.mjs --inplace  # rewrites files in place (CI/check mode)
 *   node scripts/build-fragments.mjs --check    # exits non-zero if any include is unresolved
 *
 * Marker syntax (in any .md file under design/, engineering/, ai/):
 *   <!-- include: fragments/colors-tokens.md -->
 *
 * The marker is replaced with the fragment's content (frontmatter stripped).
 * Cycles are detected and abort the build.
 */

import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FRAGMENTS_DIR = join(ROOT, "fragments");
const SOURCE_DIRS = ["design", "engineering", "ai"];
const OUTPUT_DIR = join(ROOT, "dist");

const INCLUDE_RE = /<!--\s*include:\s*(fragments\/[a-z0-9-]+\.md)\s*-->/g;

/**
 * Mask out fenced code blocks (```...```) and inline code (`...`) so that
 * include markers shown as examples in docs are not treated as real markers.
 * Returns the masked content (markers replaced by same-length placeholders) so
 * indices line up with the original.
 */
function maskCode(content) {
  let result = content;
  // Fenced code blocks (lazy non-greedy, multi-line)
  result = result.replace(/```[\s\S]*?```/g, (m) => " ".repeat(m.length));
  // Inline code (no newlines inside)
  result = result.replace(/`[^`\n]*`/g, (m) => " ".repeat(m.length));
  return result;
}

const args = new Set(process.argv.slice(2));
const inplace = args.has("--inplace");
const check = args.has("--check");

function stripFrontmatter(md) {
  if (md.startsWith("---\n")) {
    const end = md.indexOf("\n---\n", 4);
    if (end !== -1) return md.slice(end + 5).trimStart();
  }
  return md;
}

async function loadFragment(name, cache, stack) {
  if (stack.has(name)) {
    throw new Error(
      `Cycle detected in fragment includes: ${[...stack, name].join(" → ")}`,
    );
  }
  if (cache.has(name)) return cache.get(name);
  const path = join(ROOT, name);
  let content;
  try {
    content = await readFile(path, "utf8");
  } catch {
    throw new Error(`Fragment not found: ${name}`);
  }
  const stripped = stripFrontmatter(content);
  const resolved = await resolveIncludes(stripped, cache, new Set([...stack, name]));
  cache.set(name, resolved);
  return resolved;
}

async function resolveIncludes(content, cache, stack) {
  // Run regex against masked content so code-block examples are skipped, but
  // splice the original (unmasked) content using those same indices.
  const masked = maskCode(content);
  const matches = [...masked.matchAll(INCLUDE_RE)];
  if (matches.length === 0) return content;
  let result = "";
  let lastIdx = 0;
  for (const m of matches) {
    result += content.slice(lastIdx, m.index);
    const fragmentContent = await loadFragment(m[1], cache, stack);
    result += fragmentContent;
    lastIdx = m.index + m[0].length;
  }
  result += content.slice(lastIdx);
  return result;
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && e.name.endsWith(".md")) yield full;
  }
}

async function processFile(srcPath, cache) {
  const content = await readFile(srcPath, "utf8");
  // Cheap no-side-effects pre-check (regex.test with /g flag would mutate lastIndex
  // and cause subsequent files to skip leading matches).
  if (!content.includes("<!-- include: fragments/")) {
    return { changed: false, content };
  }
  const resolved = await resolveIncludes(content, cache, new Set());
  return { changed: resolved !== content, content: resolved };
}

async function main() {
  const cache = new Map();
  let unresolved = 0;
  let processed = 0;

  for (const dir of SOURCE_DIRS) {
    const srcRoot = join(ROOT, dir);
    let exists = true;
    try {
      await stat(srcRoot);
    } catch {
      exists = false;
    }
    if (!exists) continue;

    for await (const srcPath of walk(srcRoot)) {
      processed++;
      const { changed, content } = await processFile(srcPath, cache);

      if (check) {
        if (changed) {
          console.log(`would resolve includes in: ${relative(ROOT, srcPath)}`);
        }
        continue;
      }

      if (inplace) {
        if (changed) {
          await writeFile(srcPath, content, "utf8");
          console.log(`resolved → ${relative(ROOT, srcPath)}`);
        }
      } else {
        const outPath = join(OUTPUT_DIR, relative(ROOT, srcPath));
        await mkdir(dirname(outPath), { recursive: true });
        await writeFile(outPath, content, "utf8");
        console.log(`wrote → ${relative(ROOT, outPath)}`);
      }
    }
  }

  console.log(
    `\n${processed} markdown files scanned, ${cache.size} fragments resolved${unresolved ? `, ${unresolved} unresolved` : ""}.`,
  );
  if (unresolved && check) process.exit(1);
}

main().catch((err) => {
  console.error("build-fragments failed:", err.message);
  process.exit(1);
});
