# agents.md — AI Agent Conventions for RxDev Man

This document defines conventions for AI agents (and humans) working in this codebase. Follow these rules to maintain consistency.

---

## Project Identity

RxDev Man is a personal developer knowledge base — a blog with MDX content, tool showcases, and visitor tracking. Single author, no auth, no social features. The site is deployed to Vercel as static assets with selective SSR.

**Stack:** Astro 7.x, TypeScript 6.x, MDX, Supabase, Vercel, Bun

---

## File Naming

| Type             | Convention         | Examples                                   |
| ---------------- | ------------------ | ------------------------------------------ |
| Astro components | `PascalCase.astro` | `BlogPostCard.astro`, `InfoBox.astro`      |
| Layouts          | `PascalCase.astro` | `BaseLayout.astro`, `BlogPostLayout.astro` |
| TypeScript utils | `kebab-case.ts`    | `reading-time.ts`, `post-utils.ts`         |
| TypeScript lib   | `kebab-case.ts`    | `blog.ts`, `hash.ts`, `supabase.ts`        |
| Pages            | `kebab-case.astro` | `index.astro`, `about.astro`               |
| API routes       | `kebab-case.ts`    | `track.ts`                                 |
| Blog post dirs   | `kebab-case/`      | `rust-ownership-memory-management/`        |
| CSS files        | `kebab-case.css`   | `global.css`                               |
| Config files     | `kebab-case.*`     | `content.config.ts`, `eslint.config.mjs`   |

Enforced by ESLint `unicorn/filename-case` rule.

---

## Import Conventions

Use the `@/*` path alias for all internal imports:

```ts
import BaseLayout from '@/layouts/BaseLayout.astro';
// Correct
import { calculateReadingTime } from '@/utils/reading-time';

// Wrong
import { calculateReadingTime } from '../../utils/reading-time';
```

Import order is enforced by `perfectionist/sort-imports`.

---

## TypeScript Conventions

- Use `type` keyword for type definitions, not `interface` (enforced by ESLint).
- Use `import.meta.env` for environment variables, never `process.env` (enforced by ESLint).
- Strict mode is enabled (`astro/tsconfigs/strict`).

---

## Component Conventions

### Structure

Every Astro component follows this pattern:

1. **Frontmatter** (between `---` fences): TypeScript imports, type definitions, and logic.
2. **Template HTML**: The component's markup.
3. **Scoped `<style>`**: CSS that doesn't leak to other components.

### Auto-imported Components

Content components are auto-imported via `astro-auto-import` in `astro.config.mjs`. MDX files use them without import statements:

```mdx
<InfoBox title="Note" type="info">
  Content here.
</InfoBox>
```

If you add a new component to `src/components/content/`, register it in `astro.config.mjs` under the `autoImport` integration.

---

## Design Token Usage

**Rule:** Never use raw hex/rgb values in component styles. Always reference a CSS custom property.

```css
/* Correct */
color: var(--text-primary);
background-color: var(--surface-card);
border: 1px solid var(--border-default);

/* Wrong */
color: #4d4f46;
background-color: #ffffff;
border: 1px solid #bfc1b7;
```

**Exceptions:**

- Social brand colors in `ShareButtons.astro` (Facebook blue, LINE green, etc.) — these are third-party brand requirements, not design choices.
- Terminal UI colors in `index.astro` — these are decorative and part of the terminal aesthetic.

**Token hierarchy:**

```
Primitive (raw hex) → Semantic (meaning) → Component (specific)
--color-gray-700    → --text-primary      → (none needed)
```

Components should only reference semantic tokens. Primitives are only referenced by semantic token definitions in `global.css`.

---

## CSS Layer Architecture

```css
@layer reset, base, components, utilities;
```

- `reset` — box model normalization
- `base` — element styles (body, headings, links)
- `components` — component styles
- `utilities` — helper classes

Never add unlayered styles except for specific overrides (document why).

---

## Accessibility

- Use `aria-label` on interactive elements.
- Use `aria-hidden="true"` on decorative elements.
- Use `prefers-reduced-motion: reduce` media queries on all transitions/animations.
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`).
- Keyboard navigation must work for all interactive elements.
- Focus management in modals/overlays (trap focus, restore on close).

---

## Environment Variables

| Variable                    | Prefix    | Purpose                                |
| --------------------------- | --------- | -------------------------------------- |
| `PUBLIC_SUPABASE_URL`       | `PUBLIC_` | Supabase project URL (client-visible)  |
| `PUBLIC_SUPABASE_ANON_KEY`  | `PUBLIC_` | Supabase anon key (client-visible)     |
| `SUPABASE_SERVICE_ROLE_KEY` | (none)    | Server-side only — bypasses RLS        |
| `HASH_SALT`                 | (none)    | Salt for IP hashing (server-side only) |

**Never prefix secrets with `PUBLIC_`.** The `PUBLIC_` prefix causes Astro to bundle the value into client-side JavaScript.

---

## Supabase Access Pattern

Two clients exist in `src/lib/supabase.ts`:

- `getSupabaseServer()` — uses service role key, bypasses RLS. **Server-side only** (API routes, SSR frontmatter).
- `getSupabasePublic()` — uses anon key, subject to RLS. Client-side safe.

Both use lazy singleton initialization. Never create a new client per request.

---

## Blog Post Structure

Posts live at `src/content/blog/<slug>/index.mdx`.

```yaml
---
title: Article Title
description: Short description for SEO.
pubDate: 2026-01-15
heroImage: ./hero-image.png
category: Category Name
tags: [Tag1, Tag2]
featured: true
---
```

- `heroImage` is relative to the post directory.
- `pubDate` is YYYY-MM-DD (coerced to Date by Zod).
- `category` is a single string.
- `tags` is an array of strings.

---

## Adding New Features

1. Check if it fits the project scope (see ROADMAP.md).
2. Follow existing patterns (look at similar components/pages).
3. Use design tokens, not raw values.
4. Add accessibility attributes.
5. Test at mobile breakpoints.
6. Verify `bun run lint` and `bun run build` pass.

---

## What NOT to Do

- Do not add comments unless asked.
- Do not add `console.log` in production code (ESLint warns).
- Do not use `process.env` (ESLint errors).
- Do not use `interface` for type definitions (ESLint errors).
- Do not use relative paths for imports (use `@/*`).
- Do not add inline hex colors in styles (use tokens).
- Do not add features that break the single-author, calm, content-first shape.
